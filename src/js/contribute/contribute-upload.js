
import Dropzone from "dropzone";
import "dropzone/dist/dropzone.css";
import { setModalText, triggerTooltip } from '../contribute/tooltips.js';

const contributeUploadTooltip = document.getElementById('contributeUploadTooltip');

let numFiles = 0;

const initContributeUpload = () => {
    initDropzone();
    setContributeEventListeners();
};

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
        let uploadedMimeTypes = getMimeTypeOfUploadedFiles(myDropzone);
        checkNumberOfUploadedFiles(uploadedMimeTypes);
    });

    myDropzone.on("complete", (file) => {
        numFiles++;
        let uploadedMimeTypes = getMimeTypeOfUploadedFiles(myDropzone);
        checkNumberOfUploadedFiles(uploadedMimeTypes);
    });

    myDropzone.on("error", (file, errorMessage) => {
        console.log("error");
    });
};

const getMimeTypeOfUploadedFiles = (myDropzone) => {
    let uploadedMimeTypes = [];
    myDropzone.files.forEach((file) => {
        let fileMimeType = file.type;
        if(fileMimeType === 'image/jpeg' || fileMimeType === 'image/png' || fileMimeType === 'image/jpg') {
            fileMimeType = 'image/jpg';
        }
        uploadedMimeTypes.push(fileMimeType);
    });
    return uploadedMimeTypes;
};

const checkNumberOfUploadedFiles = (uploadedMimeTypes) => {
    // console.log("doSomething");
    // console.log(numFiles);

    const singleFileElement = document.getElementById("dropzone-single-file");
    const multipartFileElement = document.getElementById("dropzone-multipart-file");
    const externalResource = document.getElementById("external-resource-upload-form");

    // if uploadedmimeTypes contains mix of different mime types return
    if (uploadedMimeTypes.length > 1 && new Set(uploadedMimeTypes).size > 1) {
        toggleVisibility(singleFileElement, multipartFileElement, externalResource, true, false, false);
        return;
    }

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

const setContributeEventListeners = () => {
    if (!contributeUploadTooltip) {
        return;
    }

    contributeUploadTooltip.addEventListener('click', (e) => {
        e.preventDefault();
        contributeUploadTooltipModal();
    });
};

const contributeUploadTooltipModal = () => {
    console.log("CLICKED!")
    setModalText('contributeUploadTooltip');
    triggerTooltip();
};

export { initContributeUpload };