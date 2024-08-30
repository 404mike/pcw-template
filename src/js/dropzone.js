
import Dropzone from "dropzone";
import "dropzone/dist/dropzone.css";

let numFiles = 0;

const initDropzone = () => {

    if(document.getElementById("dropzone") === null) {
        return;
    }

    let myDropzone = new Dropzone("div#dropzone", { 
        url: "/file/post",
        addRemoveLinks: true,
        acceptedMimeTypes: "image/png,image/jpeg,audio/mp4,video/mp4,audio/mp3,audio/mpeg,application/pdf",
        dictDefaultMessage: "",
    });

    myDropzone.on("addedfile", (file) => {});
    myDropzone.on("success", (file) => {});

    myDropzone.on("removedfile", (file) => {
        console.log("removedfile");
        numFiles--;
        checkNumberOfUploadedFiles();
    });

    myDropzone.on("error", (file, errorMessage) => {
        console.log("error");
    });

    myDropzone.on("complete", (file) => {
        console.log("complete");
        numFiles++;
        checkNumberOfUploadedFiles();
    });
};

const checkNumberOfUploadedFiles = () => {
    console.log("doSomething");
    console.log(numFiles);

    const singleFileElement = document.getElementById("dropzone-single-file");
    const multipartFileElement = document.getElementById("dropzone-multipart-file");
    const externalResource = document.getElementById("external-resource-upload-form");

    if (numFiles === 1) {
        singleFileElement.classList.remove("d-none");
        singleFileElement.classList.add("d-block");
        multipartFileElement.classList.remove("d-block");
        multipartFileElement.classList.add("d-none");
        externalResource.classList.remove("d-block");
        externalResource.classList.add("d-none");
    } 
    if(numFiles > 1) {
        singleFileElement.classList.remove("d-block");
        singleFileElement.classList.add("d-none");
        multipartFileElement.classList.remove("d-none");
        multipartFileElement.classList.add("d-block");
        externalResource.classList.remove("d-block");
        externalResource.classList.add("d-none");
    }
    if(numFiles === 0) {
        singleFileElement.classList.remove("d-block");
        singleFileElement.classList.add("d-none");
        multipartFileElement.classList.remove("d-block");
        multipartFileElement.classList.add("d-none");
        externalResource.classList.remove("d-none");
        externalResource.classList.add("d-block");
    }
};


export { initDropzone };