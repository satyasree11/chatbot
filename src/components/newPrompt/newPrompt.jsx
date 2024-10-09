import { IKImage } from 'imagekitio-react';
import Upload from '../upload/upload';
import './newPrompt.css';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import model from '../../lib/gemini';
import { useNavigate } from "react-router-dom";
import { useRef ,useEffect, useState} from 'react';
import Markdown from 'react-markdown';

const NewPrompt = ({data}) => {
  const [question,setQuestion]=useState("")
  const [answer,setAnswer]=useState("");
  const [img,setImg] = useState({
    isLoading:false,
    error:"",
    dbData:{},
    aiData:{}
  })
   const chat = model.startChat({
  history: [
    {
      role: "user",
      parts: [{ text: "Hello" }],
    },
    {
      role: "model",
      parts: [{ text: "Great to meet you. What would you like to know?" }],
    },
  ],
});
    const endRef= useRef(null);
    const formRef=useRef(null)
  useEffect(()=>{
    endRef.current.scrollIntoView({behavior:"smooth"})
  },[data,answer,question,img]);
   const queryClient = useQueryClient();

  

  const mutation = useMutation({
    mutationFn: () => {
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${data._id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question:question.length ? question:undefined,
          answer,
          img:img.dbData?.filePath || undefined,
         }),
      }).then((res) => res.json());
    },
    onSuccess: (id) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["chat",data._id] }).then(()=>{
         formRef.current.reset();
        setQuestion("");
        setAnswer("");
       
        setImg({
          isLoading:false,
    error:"",
    dbData:{},
    aiData:{}
        })
      })
      
    },
    onError: (err)=>{
      console.log(err);
    }
  });
 const add = async (text, isInitial) => {
    if (!isInitial) setQuestion(text);

    try {
      const result = await chat.sendMessageStream(
        Object.entries(img.aiData).length ? [img.aiData, text] : [text]
      );
      let accumulatedText = "";
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        console.log(chunkText);
        accumulatedText += chunkText;
        setAnswer(accumulatedText);
      }

      mutation.mutate();
    } catch (err) {
      console.log(err);
    }
  };
  const handleSubmit = async(e) =>{
    e.preventDefault();
    const text=e.target.text.value.trim();
    if(!text) return;
    add(text);

  }
  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current) {
      if (data?.history?.length === 1) {
        add(data.history[0].parts[0].text, true);
      }
    }
    hasRun.current = true;
  }, []);

  return (
    <>
    {img.isLoading && <div>Loading...</div>}
    {img.dbData?.filePath && (
        <IKImage
          urlEndpoint={import.meta.env.VITE_IMAGEKIT_ENDPOINT}
          path={img.dbData?.filePath}
          width="380"
          transformation={[{ width: 380 }]}

        />
      )}
      {question && <div className='message user'>{question}</div>}
      {answer && <div className='message'><Markdown>{answer}</Markdown></div>}
    <div className='endChat' ref={endRef}>
      
        <form  className="newForm" onSubmit={handleSubmit}ref={formRef}>
            <Upload setImg={setImg}/>
            <input type="file" id='file' multiple={false} hidden />
            <input type="text" name='text' placeholder='Ask anything...' />
            <button>
                <img src="/arrow.png" alt="" />
            </button>
        </form>
    </div>
    </>
  );
};

export default NewPrompt;