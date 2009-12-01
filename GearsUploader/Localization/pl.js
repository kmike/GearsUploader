/**
 * Polish localization for uploader classes.
 *
 * Include it after other uploader files and statuses becomes Polish.
 *
 * Author: Mikhail Korobov, Maciej Wiśniowski
 * License: MIT
 *
 */

if (window.GearsUploader) {
    GearsUploader.implement('options', {
        statuses: {
            'noFiles': 'Proszę wybrać pliki do załadowania.',
            'alreadyUploaded': 'Pliki zostały już załadowane.',
            'processing': 'Przetwarzanie plików..',
            'selected': 'Pliki zostały wybrane.',

            'stateUninitialized': 'Inicjalizacja..',
            'stateOpen': 'Ładowanie plików..',
            'stateSent': 'Pliki zostały załadowane, oczekiwanie na odpowiedź serwera..',
            'stateInteractive': 'Odczytywanie odpowiedzi serwera..',
            'stateComplete': 'Pliki zostały załadowane.'
        }
    });
}

if (window.GearsSingleFileUploader) {
    GearsSingleFileUploader.implement('options', {
        statuses: {
            'noFiles': 'Proszę wybrać plik do załadowania.',
            'alreadyUploaded': 'Plik został już załadowany.',
            'processing': 'Przetwarzanie pliku..',
            'selected': 'Plik został wybrany.',

            'stateUninitialized': 'Inicjalizacja..',
            'stateOpen': 'Plik jest ładowany..',
            'stateSent': 'Plik został załadowany, oczekiwanie na odpowiedź serwera..',
            'stateInteractive': 'Odczytywanie odpowiedzi serwera..',
            'stateComplete': 'Plik został załadowany.'
        }
    });
}

if (window.GearsImageUploader) {
    GearsImageUploader.implement('options', {
        statuses: {
            'noFiles': 'Proszę wybrać pliki do załadowania.',
            'alreadyUploaded': 'Obrazy zostały już załadowane.',
            'processing': 'Przetwarzanie obrazów..',
            'selected': 'Obrazy zostały wybrane.',

            'stateUninitialized': 'Inicjalizacja..',
            'stateOpen': 'Ładowanie obrazów..',
            'stateSent': 'Obrazy zostały załadowane, oczekiwanie na odpowiedź serwera..',
            'stateInteractive': 'Odczytywanie odpowiedzi serwera..',
            'stateComplete': 'Obrazy zostały załadowane.'
        }
    });
}

if (window.GearsSingleImageUploader) {
    GearsSingleImageUploader.implement('options', {
        statuses: {
            'noFiles': 'Obraz nie został wybrany.',
            'alreadyUploaded': 'Ten obraz został już załadowany.',
            'processing': 'Przetwarzanie obrazu..',
            'selected': 'Obraz został wybrany.',

            'stateUninitialized': 'Initicjalizacja..',
            'stateOpen': 'Ładowanie obrazu..',
            'stateSent': 'Oczekiwanie na odpowiedź serwera..',
            'stateInteractive': 'Odczytywanie odpowiedzi serwera..',
            'stateComplete': 'Obraz został załadowany.'
        }
    });
}
