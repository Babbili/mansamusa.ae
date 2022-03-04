declare module "filepond-plugin-image-editor" {
    const FilePondPluginImageEditor: FilePondPluginImageEditorProps;
    export interface FilePondPluginImageEditorProps {
        /** Enable or disable image editor */
        allowImageEditor?: boolean;

        /** Enable or disable instant edit mode */
        imageEditorInstantEdit?: boolean;

        /** Enable or disable edit button */
        imageEditorAllowEdit?: boolean;

        /** Enable or disable outputing an image */
        imageEditorWriteImage?: boolean;

        /** Image Editor configuration object */
        imageEditor?: any;
        
        /** Image Editor edit icon */
        imageEditorIconEdit?: string;

        /** Image Editor edit button position */
        styleImageEditorButtonEditItemPosition?: string;
    }
    export default FilePondPluginImageEditor;
}