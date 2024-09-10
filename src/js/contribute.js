import { initContributeEdit } from './contribute/edit-metadata.js';
import { initContributeUpload } from './contribute/contribute-upload.js';

const initContribute = () => {
    initContributeEdit();
    initContributeUpload();
};

export { initContribute };