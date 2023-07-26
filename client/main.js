import bot_icon from './icons/robot-line-icon.svg';
import user_icon from './icons/profile.svg';

// generates an random id for the 
function generate_ID(){
    const time = Date.now();
    const number = Math.random();
    return `id-${time}-${number}`;
}

// The typing "animation" the bot performs by slowly adding words
function bot_typing(e, text){
    let curr_pos = 0;
    let type_interval = setInterval(() => {
        if(curr_pos < text.length){
            e.textContent += text.charAt(curr_pos);
            curr_pos++;
        } else {
            clearInterval(type_interval);
        }
    }, 30)
}

// determines what value and color the background would
// be based on if the response is from an user or ai
function stripes(is_ai, value, ID){
    return (`
           <div class="wrapper ${is_ai && 'gpt'}">
                <div class="chat">
                    <div class="pfp">
                    <img src="${is_ai ? bot_icon : user_icon}"
                         alt="${is_ai ? 'bot' : 'user'}"
                    />
                    </div>
                    <div class="message" id=${ID}>${value}</div>
                </div>
           </div>
           `
    );
}

const handle_submission = async (e) => {
    // prevent browser refresh
    e.preventDefault();
    form.style.display = 'none';

    const user_input = new FormData(form);

    // generate users chat stripe
    container.innerHTML += stripes(false, user_input.get('prompt'));

    form.reset();

    // generate bots chat stripe
    const ID = generate_ID();
    container.innerHTML += stripes(true, " ", ID);

    container.scrollTop = container.scrollHeight;

    const message = document.getElementById(ID);

    // Bot thinking ...
    message.textContent = '';

    let think_interval = setInterval(() => {
        message.textContent += '.';
        if (message.textContent === '....'){
            message.textContent = '';
        }
    }, 300) 

    // recieve response from api
    const GPT_response = await fetch('https://gpt-30fg.onrender.com',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: user_input.get('prompt')
        })
    });

    // stops thinking and clears the board
    clearInterval(think_interval);
    message.innerHTML = '';

    //formats the response to display
    if(GPT_response.ok) {

      const parsed_data = await GPT_response.json();
      bot_typing(message, parsed_data['GPT'].trim());
    } else {
      const err = await GPT_response.text();

      message.innerHTML = "ERROR";
      alert(err);
    }
    form.style.display = '';
}

const form = document.querySelector('form');
const container = document.querySelector('#container');

form.addEventListener('submit', handle_submission);
form.addEventListener('keydown', (e) => {
    if(e.code === 'Enter'){
        handle_submission(e);
    }
})