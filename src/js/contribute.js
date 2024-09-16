import { initContributeEdit } from './contribute/edit-metadata.js';
import { initContributeUpload } from './contribute/contribute-upload.js';
import { runQuill } from './contribute/quill.js';

const initContribute = () => {
    initContributeEdit();
    initContributeUpload();
    runQuill();
};

export { initContribute };