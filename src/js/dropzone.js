
import Dropzone from "dropzone";
import "dropzone/dist/dropzone.css";

let numFiles = 0;

const initDropzone = () => {

    if (document.getElementById("dropzone") === null) {
        return;
    }

    let myDropzone = new Dropzone("div#dropzone", { 
        url: "/file/post",  // This will not actually work without a server
        autoProcessQueue: false, // Prevent auto processing when file is dropped
        addRemoveLinks: true,
        acceptedMimeTypes: "image/png,image/jpeg,audio/mp4,video/mp4,audio/mp3,audio/mpeg,application/pdf",
        dictDefaultMessage: "",
        init: function() {
            this.on("addedfile", (file) => {
                // Fake a successful upload with a timeout
                setTimeout(() => {
                    this.emit("success", file);
                    this.emit("complete", file);
                }, 500);
            });
        }
    });

    myDropzone.on("success", (file) => {});

    myDropzone.on("removedfile", (file) => {
        numFiles--;
        checkNumberOfUploadedFiles();
    });

    myDropzone.on("complete", (file) => {
        numFiles++;
        checkNumberOfUploadedFiles();
    });

    myDropzone.on("error", (file, errorMessage) => {
        console.log("error");
    });
};

const checkNumberOfUploadedFiles = () => {
    console.log("doSomething");
    console.log(numFiles);

    const singleFileElement = document.getElementById("dropzone-single-file");
    const multipartFileElement = document.getElementById("dropzone-multipart-file");
    const externalResource = document.getElementById("external-resource-upload-form");

    numFiles === 1 ? toggleVisibility(singleFileElement, multipartFileElement, externalResource, true) :
    numFiles > 1 ? toggleVisibility(singleFileElement, multipartFileElement, externalResource, false, true) :
    toggleVisibility(singleFileElement, multipartFileElement, externalResource, false, false, true);
};

const toggleVisibility = (single, multiple, external, showSingle = false, showMultiple = false, showExternal = false) => {
    single.classList.toggle("d-block", showSingle);
    single.classList.toggle("d-none", !showSingle);
    multiple.classList.toggle("d-block", showMultiple);
    multiple.classList.toggle("d-none", !showMultiple);
    external.classList.toggle("d-block", showExternal);
    external.classList.toggle("d-none", !showExternal);
};

export { initDropzone };