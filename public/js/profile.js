const profileManager = {
    start(){
        console.log('Profile Manager Started');
        this.attachEventListeners();
    },

    attachEventListeners(){
        document.querySelector(".removePhoto").addEventListener("click", async (e) => {
            e.preventDefault();
            let image = document.querySelector(".profile-image");
            if(image.src === "https://via.placeholder.com/150"){
                return;
            }else{
                try {
                    await axios.delete("/api/profile/rm");
                    image.src = "";
      
                  } catch (error) {
                      console.error(error)
                  }
            }
          });
    },
};

// Main initialization
document.addEventListener('DOMContentLoaded', () => {
       profileManager.start();
 });