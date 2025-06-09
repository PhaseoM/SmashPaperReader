from socket import SocketIO

from openai import OpenAI
import requests


class gpt_model:
    def __init__(self,
                 base_url='http://localhost:11434/v1/',
                 api_key='ollama',
                 model='deepseek-r1:1.5b'):
        self.client = OpenAI(base_url=base_url, api_key=api_key)
        self.model = model

    def send_msg(self, func_call, msgid, question, context=None, role='user'):

        SYSTEM_PROMPT = """
        You are an intelligent assistant that can understand the contents of research papers. 
        You are knowledgeable in different fields and domains of science, in particular computer science.
        You are able to find answers to the questions from the contextual passage snippets provided.
        """

        USER_PROMPT = f"""
        Use the following pieces of information enclosed in <context> tags to provide an answer to the question enclosed in <question> tags.
        <context>
        {context}
        </context>
        <question>
        {question}
        </question>
        """

        messages = [
            {
                'role': 'system',
                'content': [{'type': 'text', 'text': SYSTEM_PROMPT}]
            },
            {
                'role': role,
                'content': [{'type': 'text', 'text': USER_PROMPT}]
            }
        ]

        chat_completion = self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=0.7,
            top_p=0.95,
            max_tokens=800,
            stream=True
        )
        is_think = False
        res_content = ""
        for stream_message in chat_completion:
            stream_content = stream_message.choices[0].delta.content
            res_content += stream_content
            if stream_content == "<think>" and is_think == False:
                is_think = True
                continue
            if stream_content == "</think>" and is_think == True:
                is_think = False
                continue
            if is_think:
                func_call(type='ai_send_stream',
                          msgid=msgid,
                          select=stream_content,
                          context="",
                          HintList=[])
            else:
                func_call(type='ai_send_stream',
                          msgid=msgid,
                          select=None,
                          context=stream_content,
                          HintList=[])
        print(f'{"llm_ret":-^30}')
        print(res_content)
        print(f'{"":-^30}')
    def send_compare_paperAB(self, func_call, msgid):
        pA={
            'title':"The Semantic Reader Project: Augmenting Scholarly Documents through AI-Powered Interactive Reading Interfaces",
            'abstract':"""Scholarly publications are key to the transfer of knowledge from
scholars to others. However, research papers are information-dense,
and as the volume of the scientific literature grows, the need for new
technology to support the reading process grows. In contrast to the
process of finding papers, which has been transformed by Internet
technology, the experience of reading research papers has changed
little in decades. The PDF format for sharing papers is widely used
due to its portability, but it has significant downsides including:
static content, poor accessibility for low-vision readers, and diffi-
culty reading on mobile devices. This paper explores the question
“Can recent advances in AI and HCI power intelligent, interactive,
and accessible reading interfaces—even for legacy PDFs?” We de-
scribe the Semantic Reader Project, a collaborative effort across
multiple institutions to explore automatic creation of dynamic read-
ing interfaces for research papers. Through this project, we’ve de-
veloped ten research prototype interfaces and conducted usability
studies with 300+ participants and real-world users showing im-
proved reading experiences for scholars. We’ve also released a pro-
duction research paper reader that will incorporate novel features
as they mature. We structure this paper around challenges scholars
and the public face when reading research papers—discovery, effi-
ciency, comprehension, synthesis, and accessibility—and present
an overview of our progress and remaining open challenges."""
        }
        pB={
            'title': "PaperWeaver: Enriching Topical Paper Alerts by Contextualizing Recommended Papers with User-collected Papers ",
            'abstract': """With the rapid growth of scholarly archives, researchers subscribe
to “paper alert” systems that periodically provide them with recom-
mendations of recently published papers that are similar to previ-
ously collected papers. However, researchers sometimes struggle to
make sense of nuanced connections between recommended papers
and their own research context, as existing systems only present
paper titles and abstracts. To help researchers spot these connec-
tions, we present PaperWeaver, an enriched paper alerts system
that provides contextualized text descriptions of recommended
papers based on user-collected papers. PaperWeaver employs a
computational method based on Large Language Models (LLMs) to
infer users’ research interests from their collected papers, extract
context-specifc aspects of papers, and compare recommended and
collected papers on these aspects. Our user study (N=15) showed
that participants using PaperWeaver were able to better under-
stand the relevance of recommended papers and triage them more
confdently when compared to a baseline that presented the related
work sections from recommended papers."""
        }
        SYSTEM_PROMPT = """
        You are an intelligent assistant that can understand the contents of research papers. 
        You are knowledgeable in different fields and domains of science, in particular computer science.
        You are able to interpret research papers to identify similarities and differences between research papers.
        """

        USER_PROMPT = f"""
        We would like you to compare two research papers for a researcher.
        You will be provided with the title and abstract of each paper. 
        To help you when you compare the papers, we provided a subsection of Paper A where Paper B is cited. 
        In the subsection of Paper A, cited Paper B already identified methods that are similar between the papers and 
        what problems are solved in each paper using these shared methods.
        
        [The Start of Paper A]
        Title: {pA['title']}
        Abstract:{pA['abstract']}
        [The End of Paper A]
        
        [The Start of Paper B]
        Title: {pB['title']}
        Abstract:{pB['abstract']}
        [The End of Paper B]
        
        [System]
        Please explain the content of Paper A for a researcher.
        Explain the paper by comparing it to Paper B, and interpreting the relationships between these papers.
        Your explanation should only be four sentences long and it should follow the following structure: 
        a sentence that states what aspects are similar between Paper A and Paper B, one sentence summary of Paper A, 
        one sentence summary of Paper B, and one sentence comparing and contrasting between Paper A and B
        """
        messages = [
            {
                'role': 'system',
                'content': [{'type': 'text', 'text': SYSTEM_PROMPT}]
            },
            {
                'role': 'user',
                'content': [{'type': 'text', 'text': USER_PROMPT}]
            }
        ]
        chat_completion = self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=0.7,
            top_p=0.95,
            max_tokens=800,
            stream=True
        )
        is_think = False
        res_content = ""
        for stream_message in chat_completion:
            stream_content = stream_message.choices[0].delta.content
            res_content += stream_content
            if stream_content == "<think>" and is_think == False:
                is_think = True
                continue
            if stream_content == "</think>" and is_think == True:
                is_think = False
                continue
            if is_think:
                func_call(type='ai_send_stream',
                          msgid=msgid,
                          select=stream_content,
                          context="",
                          HintList=[])
            else:
                func_call(type='ai_send_stream',
                          msgid=msgid,
                          select=None,
                          context=stream_content,
                          HintList=[])


def send_test(type, msgid, context, select, HintList):
    a = 1


if __name__ == '__main__':
    # llm = gpt_model()
    # llm.send_msg(func_call=send_test, msgid="1", question="How can I build a RAG system?")
    from ollama import Client

    client = Client(host='http://localhost:11434')
    try:
        response = client.embeddings(model='nomic-embed-text', prompt='Hello world!')
        print("Embedding:", response['embedding'][:10])
    except Exception as e:
        print("Embedding failed:", e)
