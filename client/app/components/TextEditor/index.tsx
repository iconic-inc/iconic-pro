import { ITextEditorProps } from '~/interfaces/app.interface';
import Hydrated from '../Hydrated';
import TextEditorClient from './index.client';

export default function TextEditor(props: ITextEditorProps) {
  return <Hydrated>{() => <TextEditorClient {...props} />}</Hydrated>;
}
