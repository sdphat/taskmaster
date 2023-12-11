import * as pkg from "../ckeditor/ckeditor";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

pkg;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const editor = (window as any).ClassicEditor;

const useCKEditor = (): ClassicEditor => editor;

export default useCKEditor;
