import EditorJS, { API, LogLevels, OutputData } from "@editorjs/editorjs";
import { FormControl, FormHelperText, InputLabel } from "@mui/material";
import classNames from "classnames";
import React from "react";

import { RichTextEditorContentProps, tools } from "./RichTextEditorContent";
import useStyles from "./styles";

export type RichTextEditorChange = (data: OutputData) => void;
export interface RichTextEditorProps extends RichTextEditorContentProps {
  disabled: boolean;
  error: boolean;
  helperText: string;
  label: string;
  name: string;
  onChange: RichTextEditorChange;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  data,
  disabled,
  error,
  helperText,
  label,
  name,
  onChange,
  onReady
}) => {
  const classes = useStyles({});

  const [isFocused, setFocus] = React.useState(false);
  const editor = React.useRef<EditorJS>();
  const editorContainer = React.useRef<HTMLDivElement>();

  const save = async (api: API) => {
    if(!editor.current.readOnly.isEnabled) {
      onChange(await api.saver.save());
    }
  }

  React.useEffect(
    () => {
      console.log("data", { data, disabled });

      if (data !== undefined) {
        editor.current = new EditorJS({
          data,
          holder: editorContainer.current,
          logLevel: "ERROR" as LogLevels,
          onChange: api => save(api),
          onReady: () => {
            // FIXME: This throws an error and is not working
            // const undo = new Undo({ editor });
            // undo.initialize(data);

            if (onReady) {
              onReady();
            }
          },
          // TODO: [SB-50] Need to investigate why this editor is not working
          readOnly: disabled,
          tools
        });
      }

      return editor.current?.destroy;
    },
    // Rerender editor only if changed from undefined to defined state
    [data === undefined]
  );

  return (
    <FormControl
      data-test="richTextEditor"
      data-test-id={name}
      disabled={disabled}
      error={error}
      fullWidth
      variant="outlined"
    >
      <InputLabel focused={true} shrink={true}>
        {label}
      </InputLabel>
      <div
        className={classNames(classes.editor, classes.root, {
          [classes.rootActive]: isFocused,
          [classes.rootDisabled]: disabled,
          [classes.rootError]: error
        })}
        ref={editorContainer}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      />
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  );
};

RichTextEditor.displayName = "RichTextEditor";
export default RichTextEditor;
