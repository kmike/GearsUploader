/**
 * Russian localization for uploader classes.
 *
 * Include it after other uploader files and statuses becomes Russian.
 *
 * Author: Mikhail Korobov
 * License: MIT
 *
 */

if (window.GearsUploader) {
    GearsUploader.implement('options', {
        statuses: {
            'noFiles': 'Ни одного файла не выбрано.',
            'alreadyUploaded': 'Эти файлы уже были загружены.',
            'processing': 'Обработка файлов..',
            'selected': 'Файлы подготовлены к загрузке.',

            'stateUninitialized': 'Подготовка..',
            'stateOpen': 'Идет загрузка файлов..',
            'stateSent': 'Файлы отправлены, ждем ответ сервера..',
            'stateInteractive': 'Получаем ответ сервера..',
            'stateComplete': 'Файлы загружены.'
        }
    });
}

if (window.GearsSingleFileUploader) {
    GearsSingleFileUploader.implement('options', {
        statuses: {
            'noFiles': 'Файл не выбран.',
            'alreadyUploaded': 'Этот файл уже был загружен.',
            'processing': 'Обработка..',
            'selected': 'Файл готов к загрузке.',

            'stateUninitialized': 'Подготовка..',
            'stateOpen': 'Идет загрузка файла..',
            'stateSent': 'Файл отправлен, ждем ответ сервера..',
            'stateInteractive': 'Получаем ответ сервера..',
            'stateComplete': 'Файл загружен на сервер.'
        }
    });
}

if (window.GearsImageUploader) {
    GearsImageUploader.implement('options', {
        statuses: {
            'noFiles': 'Ни одного файла не выбрано.',
            'alreadyUploaded': 'Эти файлы уже были загружены.',
            'processing': 'Обработка изображений..',
            'selected': 'Изображения готовы к загрузке.',

            'stateUninitialized': 'Подготовка..',
            'stateOpen': 'Идет загрузка файлов..',
            'stateSent': 'Файлы отправлены, ждем ответ сервера..',
            'stateInteractive': 'Получаем ответ сервера..',
            'stateComplete': 'Изображения загружены.'
        }
    });
}

if (window.GearsSingleImageUploader) {
    GearsSingleImageUploader.implement('options', {
        statuses: {
            'noFiles': 'Изображение не выбрано.',
            'alreadyUploaded': 'Это изображение уже было загружено.',
            'processing': 'Обработка изображения..',
            'selected': 'Изображение готово к загрузке.',

            'stateUninitialized': 'Подготовка..',
            'stateOpen': 'Идет загрузка изображения..',
            'stateSent': 'Файл отправлен, ждем ответ сервера..',
            'stateInteractive': 'Получаем ответ сервера..',
            'stateComplete': 'Изображение загружено.'
        }
    });
}