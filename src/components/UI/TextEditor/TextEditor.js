import React from 'react'
import { Editor, EditorState, ContentState, RichUtils, getDefaultKeyBinding, convertFromHTML } from 'draft-js'
import { stateToHTML } from 'draft-js-export-html'

import 'draft-js/dist/Draft.css'
import './RichEditor.css'


class TextEditor extends React.Component {

    constructor(props) {

        super(props)

        this.state = {
            lang: 'en',
            textAlignment: 'left',
            languages: ['en', 'ar'],
            editorState: EditorState.createEmpty()
            // editorState: this.props.productDescription !== undefined && this.props.productDescription.length > 0 ?
            //   EditorState.createWithContent(ContentState.createFromText(this.props.productDescription)) :
            //   EditorState.createEmpty()
        }

        this.focus = () => this.refs.editor.focus()
        this.onChange = (editorState) => {
            const contentState = editorState.getCurrentContent()
            // editorState.getCurrentContent().getPlainText('\u0001')
            // this.props.handleEditor(convertToRaw(contentState))
            this.props.handleEditor(contentState.getPlainText('\u0001'), this.state.lang)
            setTimeout(() => {
                this.props.handleEditorHtml(stateToHTML(contentState), this.state.lang)
            }, 100)
            this.setState({
                editorState
            })
        }

        this.langSwitch = (lang) => {

            const blocksFromHTML = convertFromHTML(this.props.descriptionHtml[lang])
            const state = ContentState.createFromBlockArray(
              blocksFromHTML.contentBlocks,
              blocksFromHTML.entityMap,
            )

            this.setState({
                editorState: EditorState.createWithContent(state),
                lang,
                textAlignment: lang === 'en' ? 'left' : 'right'
            })

        }

        this.handleKeyCommand = this._handleKeyCommand.bind(this)
        this.mapKeyToEditorCommand = this._mapKeyToEditorCommand.bind(this)
        this.toggleBlockType = this._toggleBlockType.bind(this)
        this.toggleInlineStyle = this._toggleInlineStyle.bind(this)
    }

    componentDidMount () {

        const blocksFromHTML = convertFromHTML(this.props.descriptionHtml[this.state.lang])
        const state = ContentState.createFromBlockArray(
          blocksFromHTML.contentBlocks,
          blocksFromHTML.entityMap,
        )

        this.setState({
            editorState: EditorState.createWithContent(state)
        })

    }

    _handleKeyCommand(command, editorState) {
        const newState = RichUtils.handleKeyCommand(editorState, command)
        if (newState) {
            this.onChange(newState)
            return true
        }
        return false
    }

    _mapKeyToEditorCommand(e) {
        if (e.keyCode === 9 /* TAB */) {
            const newEditorState = RichUtils.onTab(
              e,
              this.state.editorState,
              4, /* maxDepth */
            )
            if (newEditorState !== this.state.editorState) {
                this.onChange(newEditorState)
            }
            return
        }
        return getDefaultKeyBinding(e)
    }

    _toggleBlockType(blockType) {
        this.onChange(
          RichUtils.toggleBlockType(
            this.state.editorState,
            blockType
          )
        )
    }

    _toggleInlineStyle(inlineStyle) {
        this.onChange(
          RichUtils.toggleInlineStyle(
            this.state.editorState,
            inlineStyle
          )
        )
    }

    render() {

        const { editorState } = this.state

        // If the user changes block type before entering any text, we can
        // either style the placeholder or hide it. Let's just hide it now.
        let className = 'RichEditor-editor'
        const contentState = editorState.getCurrentContent()
        if (!contentState.hasText()) {
            if (contentState.getBlockMap().first().getType() !== 'unstyled') {
                className += ' RichEditor-hidePlaceholder'
            }
        }

        return (

          <div className="RichEditor-root">

              <div className='lang-switch'>
                  {
                      this.state.languages.map(l => (
                        <div
                          key={l}
                          className='item'
                          style={{
                              backgroundColor: l === this.state.lang ? '#a88020' : '#eeeeee',
                              color: l === this.state.lang ? '#ffffff' : '#a88020',
                          }}
                          onClick={() => this.langSwitch(l)}
                        >
                            { l.toUpperCase() }
                        </div>
                      ))
                  }
              </div>

              <BlockStyleControls
                editorState={editorState}
                onToggle={this.toggleBlockType}
              />

              <InlineStyleControls
                editorState={editorState}
                onToggle={this.toggleInlineStyle}
              />

              <div
                className={className}
                onClick={this.focus}
              >
                  <Editor
                    blockStyleFn={getBlockStyle}
                    customStyleMap={styleMap}
                    editorState={editorState}
                    handleKeyCommand={this.handleKeyCommand}
                    keyBindingFn={this.mapKeyToEditorCommand}
                    onChange={this.onChange}
                    placeholder={this.props.placeholder}
                    ref="editor"
                    spellCheck={true}
                    textAlignment={this.state.textAlignment}
                  />
              </div>
          </div>
        )
    }
}

// Custom overrides for "code" style.
const styleMap = {
    CODE: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
        fontSize: 16,
        padding: 2,
    }
}

function getBlockStyle(block) {
    switch (block.getType()) {
        case 'blockquote': return 'RichEditor-blockquote'
        default: return null
    }
}

class StyleButton extends React.Component {

    constructor() {
        super()
        this.onToggle = (e) => {
            e.preventDefault();
            this.props.onToggle(this.props.style)
        }
    }

    render() {

        let className = 'RichEditor-styleButton'
        if (this.props.active) {
            className += ' RichEditor-activeButton'
        }

        return (
          <span className={className} onMouseDown={this.onToggle}>
              {this.props.label}
            </span>
        )
    }
}

const BLOCK_TYPES = [
    {label: 'H1', style: 'header-one'},
    {label: 'H2', style: 'header-two'},
    {label: 'H3', style: 'header-three'},
    {label: 'H4', style: 'header-four'},
    {label: 'H5', style: 'header-five'},
    {label: 'H6', style: 'header-six'},
    {label: 'Blockquote', style: 'blockquote'},
    {label: 'UL', style: 'unordered-list-item'},
    {label: 'OL', style: 'ordered-list-item'},
    {label: 'Code Block', style: 'code-block'},
]

const BlockStyleControls = (props) => {
    const {editorState} = props;
    const selection = editorState.getSelection()
    const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType()

    return (
      <div className="RichEditor-controls">
          {BLOCK_TYPES.map((type) =>
            <StyleButton
              key={type.label}
              active={type.style === blockType}
              label={type.label}
              onToggle={props.onToggle}
              style={type.style}
            />
          )}
      </div>
    )
}

const INLINE_STYLES = [
    {label: 'Bold', style: 'BOLD'},
    {label: 'Italic', style: 'ITALIC'},
    {label: 'Underline', style: 'UNDERLINE'},
    {label: 'Monospace', style: 'CODE'},
]

const InlineStyleControls = (props) => {

    const currentStyle = props.editorState.getCurrentInlineStyle()

    return (
      <div className="RichEditor-controls">
          {INLINE_STYLES.map((type) =>
            <StyleButton
              key={type.label}
              active={currentStyle.has(type.style)}
              label={type.label}
              onToggle={props.onToggle}
              style={type.style}
            />
          )}
      </div>
    )
}

export default TextEditor
