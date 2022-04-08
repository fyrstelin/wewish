import { FirebaseComponent } from './FirebaseComponent';
import { NEVER } from 'rxjs';

export abstract class FirebaseProcess<Props> extends FirebaseComponent<Props> {
  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    this.stream.next(nextProps);
  }

  setup() {
    return NEVER;
  }

  render() {
    return null;
  }
}
