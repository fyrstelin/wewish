import { FirebaseComponent } from './FirebaseComponent';
import { never } from 'rxjs';

export abstract class FirebaseProcess<Props> extends FirebaseComponent<Props> {
    UNSAFE_componentWillReceiveProps(nextProps: Props) {
        this.stream.next(nextProps);
    }

    setup() {
        return never();
    }

    render() { 
        return null; 
    }
}