from pymilvus import MilvusClient, model, Collection, connections, DataType
from sentence_transformers import SentenceTransformer

from PaperProcessing_meta import metaPaper, load_test
from DataProcessing import *

collection_name = "rag_collection"
embedding_dim = 768

testdocs = [
    "Artificial intelligence was founded as an academic discipline in 1956.",
    "Alan Turing was the first person to conduct substantial research in AI.",
    "Born in Maida Vale, London, Turing was raised in southern England.",
]

testqueries = ["When was artificial intelligence founded",
               "Where was Alan Turing born?"]


class MilvusVectorDB:
    def __init__(
            self,
            uri="./spr_milvus.db",
            # uri="http://localhost:19530",
            token="root:Milvus",
            model_name="all-mpnet-base-v2",
            embedding_dim=768,
            db_name="rag_database",
    ):
        self.client = MilvusClient(
            uri=uri,
            # token=token,
            # db_name=db_name,
        )
        # self.embedding_fn = model.dense.SentenceTransformerEmbeddingFunction(
        #     model_name=model_name,
        # )
        self.embedding_fn = SentenceTransformer(
            './EmbeddingModels/all-mpnet-base-v2',
            # cache_folder=r"./EmbeddingModels/all-mpnet-base-v2"
        )
        self.embedding_dim = embedding_dim

    def create_database(self, dbname="my_database_0"):
        self.client.create_database(
            db_name=dbname
        )

    def use_database(self, dbname="default"):
        self.client.using_database(dbname)

    def create_collection(self, collection_name="my_collection_0"):
        if self.client.has_collection(collection_name=collection_name):
            self.client.drop_collection(collection_name=collection_name)
        schema = MilvusClient.create_schema()
        schema.add_field(field_name="id", datatype=DataType.INT64, is_primary=True, auto_id=True, )
        schema.add_field(field_name="doc_id", datatype=DataType.VARCHAR, max_length=128,
                         enable_analyzer=True, enable_match=True)
        schema.add_field(field_name="chunk_type", datatype=DataType.VARCHAR, max_length=128, )
        schema.add_field(field_name="chunk_vector", datatype=DataType.FLOAT_VECTOR, dim=embedding_dim, )
        schema.add_field(field_name="chunk_content", datatype=DataType.VARCHAR, max_length=16384,
                         enable_analyzer=True, enable_match=True)
        schema.add_field(field_name="chunk_box", datatype=DataType.JSON, )
        schema.add_field(field_name="is_highlight", datatype=DataType.BOOL, )
        index_params = self.client.prepare_index_params()
        index_params.add_index(
            field_name="chunk_vector",
            index_type="FLAT",
            metric_type="COSINE",
            index_params="chunk_vector_index",
            params={},
        )
        self.client.create_collection(
            collection_name=collection_name,
            dimension=embedding_dim,
            consistency_level="Strong",
            schema=schema,
            index_params=index_params,
        )

    def embedding_queries(self, queries):
        res = self.embedding_fn.encode(queries)
        return res

    def insert_document(self, mDoc: metaPaper, collection_name="rag_collection"):
        # docs = [
        #     "".join(mDoc.doc.sentences.entities[j].text for j in range(i, i + 3))
        #     for i in range(len(mDoc.doc.sentences.entities) - 2)
        # ]
        docs = get_sent3(mDoc)
        vectors_doc = self.embedding_fn.encode(docs['content'])
        # print("========docs_embedding [0] + [-1]=========")
        # print(vectors_doc[0])
        # print(vectors_doc[-1])
        # print("================================\n")
        data = []
        for i in tqdm(range(len(vectors_doc)), desc="Inserting documents"):
            data.append({
                "doc_id": mDoc.doc_id,
                "chunk_type": "sentence_3",
                "chunk_vector": vectors_doc[i],
                "chunk_content": docs['content'][i],
                "chunk_box": docs['boxes'][i],
                "is_highlight": False
            })

        # data = [
        #     {"id": i, "vector": vectors_doc[i], "text": docs[i], "spans": "history"}
        #     for i in range(len(vectors_doc))
        # ]
        # print("========data [0] + [-1]=========")
        # print(data[0])
        # print(data[-1])
        # print("================================\n")

        self.insert(data, collection_name)

    def insert(self, data, collection_name="rag_collection"):
        self.client.insert(collection_name=collection_name, data=data)

    def search(self, queries, collection_name="rag_collection"):
        query_embeddings = self.embedding_queries(queries)
        res = self.client.search(
            collection_name=collection_name,
            data=query_embeddings,
            limit=3,
            output_fields=["chunk_content", "chunk_box", "is_highlight"],
        )
        return res

    def delete(self, ids, collection_name='rag_collection'):
        self.client.delete(collection_name=collection_name, ids=ids)

    def update(self, id, data, collection_name="rag_collection"):
        self.delete(
            collection_name=collection_name,
            ids=[id]
        )
        self.insert(data, collection_name)


def test():
    print("----Load pdf----")
    fileName = "2310.07581"
    # mDoc = metaPaper(fileName)
    # json_path = "./DocumentModels/" + fileName + ".json"
    # mDoc.load_doc(json_path)
    print("--------------------------\n")
    collection_name = "rag_collection_test_002"
    mdb = MilvusVectorDB()
    mdb.create_collection(collection_name=collection_name)
    print("----List DB----")
    print("collections:")
    print(mdb.client.list_collections())
    print("--------------------------\n")

if "__main__" == __name__:
    test()
