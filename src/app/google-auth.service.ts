import { Injectable } from '@angular/core';

declare const google: any;

@Injectable({
    providedIn: 'root',
})
export class GoogleAuthService {
    constructor() { }

    initialize(clientId: string, callback: (response: any) => void) {
        google.accounts.id.initialize({
            client_id: clientId,
            callback: callback,
        });

        google.accounts.id.renderButton(
            document.getElementById('google-button'),
            { theme: 'outline', size: 'large' }
        );

        google.accounts.id.prompt(); // Optional: Shows One Tap UI
    }
}
