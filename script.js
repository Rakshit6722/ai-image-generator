const generateForm = document.querySelector(".generate-form");
const imageGallery = document.querySelector(".image-gallery");

const OPENAI_API_KEY = "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";

const updateImageCard = (imgDataArray) => {
    imgDataArray.forEach((imgObject, index) => {
        const imgCard = imageGallery.querySelectorAll(".img-card")[index];
        const imgElement = imgCard.querySelector("img");

        //set the image source to the AI-generated image data
        const aiGeneratedImg = `data:image/jpeg;base64,${imgObject.b64_json}`;
        imgElement.src =  aiGeneratedImg; 

        ///when the image is loaded, remove the loading class
        imgElement.onload = () => {
            imgCard.classList.remove("loading");
        }

    })
}

const generateAiImages = async (userPrompt, userImgQuantity) =>{
    try{
        //send a requset to open AI to generate images based on user inputs
        const response = await fetch("https://api.openai.com/v1/images/generations",{
            method: "POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`           
            },
            body: JSON.stringify({
                prompt: userPrompt,
                n: parseInt(userImgQuantity),
                size: "512x512",
                response_format: "b64_json"
            })
        });

        if(!response.ok) throw new Error("Failed to generate images! Please try again.")
        const { data } =  await response.json();
        // console.log(data);
        updateImageCard([...data]);

    }catch(error){
        // console.log(error);
        alert(error.message);
    }
}

const handleFormSubmission = (e) =>{
    e.preventDefault();
    
    //get user input and image quantity values from the form
    const userPrompt = e.srcElement[0].value;
    const userImgQuantity = e.srcElement[1].value;

    // console.log(userPrompt, userImgQuantity);

    //creating the HTML markup for image cards with loading state
    const imgCardMarkup = Array.from({length:userImgQuantity},()=>
        `<div class="img-card loading">
        <img src="images/loader.svg" alt="">
        <a href="#" class="download-btn">
            <img src="images/download.svg" alt="">
        </a>
        </div>`
    ).join("");

    // console.log(imgCardMarkup)

    imageGallery.innerHTML = imgCardMarkup;
    generateAiImages(userPrompt, userImgQuantity);
}

generateForm.addEventListener("submit",handleFormSubmission);