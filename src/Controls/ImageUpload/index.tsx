import './styles.css';
import { ImagePreview } from '../ImagePreview';
import { IonFab, IonFabButton, IonIcon } from '@ionic/react';
import { camera } from 'ionicons/icons'
import { PureComponent } from 'react';

type Props = {
  image: string | undefined
  onUpload: (file: Blob) => Promise<void>
};
type State = {
  message?: string
};

export class ImageUpload extends PureComponent<Props, State> {
  state: State = {};
  private fileUpload?: HTMLInputElement;

  render() {
    const { image } = this.props;
    const { message } = this.state;

    return (
      <ImagePreview className='image-upload' height={140} image={image}>
        <IonFab horizontal='end' vertical='bottom'>
          <IonFabButton disabled={!!message} color='primary' onClick={this.chooseFile}>
            <IonIcon icon={camera} />
          </IonFabButton>
        </IonFab>
        <input
          type='file'
          capture
          accept='image/jpeg'
          onChange={this.uploadFile}
          ref={this.mountInput}
        />
      </ImagePreview>
    );
  }

  private phase(message: undefined | string) {
    this.setState({ message });
  }

  private mountInput = (fileUpload: HTMLElement | null) => this.fileUpload = fileUpload as HTMLInputElement;

  private chooseFile = () => {
    if (this.fileUpload) {
      this.fileUpload.click();
    }
  };

  private uploadFile = async () => {
    if (this.fileUpload && this.fileUpload.files && this.fileUpload.files[0]) {
      this.phase('Reading file');

      const file = this.fileUpload.files[0];

      await this.props.onUpload(file);

      this.phase(undefined);
    }
  }
}
