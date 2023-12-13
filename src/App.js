import './App.css';
import axios from 'axios';
import useSound from 'use-sound';
import Select from 'react-select';
import { useState ,useEffect, useRef} from 'react';
import TypeWriterSound from "./audio/typewriter.mp3";
import CollectSound from "./audio/audio_correct.mp3";
import WrongSound from "./audio/audio_wrong.mp3";

const options = [
  // #1 フォントの追加
  {value : "electroHarmonics", label : "エレクトロハーモニクス"},
  {value : "Dynalight", label : "筆記体"},
  {value : "Flow Circular", label : "難読レベル１"},
  {value: "Libre Barcode 39" , label : "難読レベル２"}
];

function App() {
  const ph = "フォントが選べます"; 
  const answer = useRef(true);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("start typing");
  const [active, setActive] = useState(false);
  const [count, setCount] = useState(0);

  const [typePlaySound] = useSound(TypeWriterSound , {onend: () =>{
    // #1点数計算を追加
    console.log("sounds good");
  }});
  const [collectSound] = useSound(CollectSound, {
    onend : () => {
      console.log("collect!");
      setActive(true);
    }
  });
  const [wrongSound] = useSound(WrongSound, {
    onend : () => {
      console.log("wrong!");
    }
  });



// fontfamilyの選択
  const ref = useRef("");
  const ChangeFamily = (val) => {
    ref.current.style.fontFamily = val.value;
  }
  const textareaRef = useRef(null);
  let currentTextarea = textareaRef.current;


  useEffect(() => {
    const getData = async() => {
      try {
        const url = "https://api.quotable.io/random";
        const res = await axios.get(url);
        setInfo(res.data.content);
      } catch (error) {
        setError(false);
      }
    }
    getData();
  },[active]);

  const changeHandler = () => {
    typePlaySound();
    const sentenceArray = document.querySelectorAll('.typeDiplay > span');
    const arrayValue = currentTextarea.value.split("");

    answer.current = true;

    sentenceArray.forEach((charsSpan,index) => {
      if((arrayValue[index] == null)) {
        charsSpan.classList.remove('corrected');
        charsSpan.classList.remove('incorrected');
        answer.current = false;
      } else if(charsSpan.innerHTML == arrayValue[index]) {
        charsSpan.classList.add('corrected');
        charsSpan.classList.remove('incorrected');
        
      } else {
        charsSpan.classList.add('incorrected');
        charsSpan.classList.remove('corrected');
        wrongSound();
        answer.current = false;
      }
    });
    if(answer.current === true ) {
      collectSound();
      currentTextarea.value = "";
      setCount(prev => prev + 1);
    }
  }

  let spiltTxt = info.split("");

  return (
    <div className='App'>
      <h1 className='top'>Various-typing-game</h1>
      <div className='selectBox'>
        <Select
          options={options}
          onChange={ChangeFamily}
          autoFocus
          placeholder={ph}
          
        />
      </div>
      <div className='typeDiplay' ref={ref}>
        {spiltTxt.map((value, i) => {
          return <span key={i}>{value}</span>
        })}
      </div>
      <textarea className='textInput' ref={textareaRef} onChange={changeHandler} autoFocus></textarea>
      <p>{!error ? error : ""}</p>
      <span className='currentCount'>正解数:{count}</span>
      <footer>
        <p>正解すると次の問題に解答できます。</p>
        <small>&copy; tkg-reis.app</small>
      </footer>
    </div>
  );
}

export default App;
