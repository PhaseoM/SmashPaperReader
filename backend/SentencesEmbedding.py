from pymilvus import model
from sentence_transformers import SentenceTransformer
from PaperProcessing_meta import metaPaper, load_test


class SentenceTransformerEmbedding:
    def __init__(self, model_name="all-mpnet-base-v2"):
        self.model = model.dense.SentenceTransformerEmbeddingFunction(
            model_name=model_name,
            device='cpu'
        )


fileName = '2310.07581.pdf'
mDoc = metaPaper(fileName)
print(load_test(mDoc, fileName))
# for i in range(0, len(mDoc.doc.sentences.entities) - 2):
sentences = []
for i in range(0, 5):
    sentences_3 = ""
    for j in range(i, i + 2):
        sentences_3 += mDoc.doc.sentences.entities[j].text
    sentences.append(sentences_3)

# embedding_sentence(sentences)
# model = SentenceTransformer('sentence-transformers/all-mpnet-base-v2')
embedding_fn = model.dense.SentenceTransformerEmbeddingFunction(
    model_name='all-mpnet-base-v2',
    device='cpu'
)
print("load model")
res = embedding_fn.encode_documents(sentences)
print("encoded")
print(f'result: {res}  \ndim:[{len(res[0])}]')

# model = SentenceTransformer('sentence-transformers/all-mpnet-base-v2')
# embeddings = model.encode(sentences)
# print(embeddings)


# docs = []
# for i in range(len(mDoc.doc.sentences.entities) - 2):
#     sentences_3 = ""
#     for j in range(i, i + 2):
#         sentences_3 += mDoc.doc.sentences.entities[j].text
#     docs.append(sentences_3)
# vectors_doc = embedding_fn.encode_documents(docs)
