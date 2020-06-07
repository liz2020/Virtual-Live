import Store from 'electron-store';

export let s_instance = null;

export class UserConfig {
    public static getInstance() {
        if (s_instance == null) {
            s_instance = new Store();
        }
        return s_instance;
    }
}
