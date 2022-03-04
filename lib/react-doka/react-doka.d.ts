import {
    DokaImageEditor as DokaImageEditorInstance,
    DokaImageEditorModal as DokaImageEditorModalInstance,
    // @ts-ignore
} from './doka';

import {
    Component,
    // @ts-ignore
} from 'react';

declare class DokaImageEditor extends Component<DokaImageEditorInstance, any> {}

declare class DokaImageEditorModal extends Component<
    DokaImageEditorInstance,
    DokaImageEditorModalInstance,
    any
> {}

declare class DokaImageEditorOverlay extends Component<DokaImageEditorInstance, any> {}
