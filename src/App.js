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
  {value : "Dynalight", label : "筆記体1"},
  {value : "sweetLovelyRainbowOne", label : "筆記体2"},
  {value : "Flow Circular", label : "線文字"},
  {value: "icecreamer" , label : "アイスクリーマー"},
  {value: "kickbox", label : "キックボックス"},
  {value: "filipinz", label : "フィリピン"},
  {value: "Checkicon", label : "チェックアイコン（欠落あり）"},
  {value: "typeFaces", label : "顔"}
];

function App() {

  const ph = "フォントが選べます"; 
  const timeout = 1300;
  const answer = useRef(true);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("start typing");
  const [active, setActive] = useState(false);
  const [count, setCount] = useState(0);

  // fontfamilyの選択
  const ref = useRef("");
  const textareaRef = useRef(null);
  let currentTextarea = textareaRef.current;
  const [typePlaySound] = useSound(TypeWriterSound , {onend: () =>{
    // #1点数計算を追加
    console.log("sounds good");
  }});
  const [collectSound] = useSound(CollectSound, {
    onend : () => {
      console.log("collect!");
      console.log();
      setActive(prev => !prev );
      // 詳細度でcssが変更されないため、変更処理
    }
  });
  const [wrongSound] = useSound(WrongSound, {
    onend : () => {
      console.log("wrong!");
    }
  });

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
      variousEffects(charsSpan);
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

      setTimeout(() => {
        for(let i = 0; i < sentenceArray.length; i++) {
          sentenceArray[i].classList.remove("corrected");
        }
      }, timeout);
      setCount(prev => prev + 1);
    }
  }

  let toUpperInfo = "";
  let currentFontType = "";
  let spiltTxt = [];

  const ChangeFamily = (val) => {
    ref.current.style.fontFamily = val.value;
    currentFontType = val.value;

    if(val.value == "typeFaces") {
      toUpperInfo = info.toUpperCase();
      console.log(toUpperInfo);
    }
  }
  
  if(currentFontType == "typeFaces") {
    spiltTxt = toUpperInfo.split("");
    console.log("cccc");
  } else {
    spiltTxt = info.split("");
  }

  const [selectedRadioOptions, setSelectedRadioOptions] = useState("");

  const handleOptionChange = (e) => {
    setSelectedRadioOptions(e.target.value);
  }

  const variousEffects = (val) => {

    // fontを動的に変更
    if(selectedRadioOptions === "moveFont") {
      return val.style.fontSize = Math.floor(Math.random() * 50) + 16 + "px";

    } 
    // else if(selectedRadioOptions === "invisibleFont") {

    // //文字色を未打なものを背景色と同じにして見えなくする。 
    //   const si = setInterval(() => {
    //     return val.classList.add("whiteChar");
    //   }, 1000);
    // } else if (val) {
    //   // ある一文字を大文字か小文字に変える

    // } else if (val) {
    //   // 様々なフォントファミリーを乱立させる

    // } else if (val) {
    //   // デフォルトに戻す選択肢

    // }

  }

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
      <div className='variousEffects'>
        <label htmlFor='moveFont'>
          <input 
          type='radio'
          name="moveFont"
          value="moveFont"
          checked={selectedRadioOptions === "moveFont"}
          onChange={handleOptionChange}
          />
          moveFont
        </label>
        <label htmlFor='invisibleFont'>
          <input
          type='radio'
          name='invisibleFont'
          value="invisibleFont"
          checked={selectedRadioOptions === "invisibleFont"}
          onChange={handleOptionChange}
          />
          invisibleFont(準備中)
        </label>
        {/* <label>
          <input
          type='radio'
          name=''
          />
        </label> */}
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
