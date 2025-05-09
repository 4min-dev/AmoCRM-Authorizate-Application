document.addEventListener("DOMContentLoaded", () => {
    const authButton = document.getElementById("authButton")
    const exchangeButton = document.getElementById("exchangeButton")
    const output = document.getElementById("output")

    async function authToAmoCRM() {
        const clientId = '69dfaa0a-020b-45b2-bac9-105f2158cad0' // ID Интеграции
        const state = '4min-dev' // Строка для защиты от CSRF атак, любое значение, необязательно
        const redirectUri = encodeURIComponent('http://localhost:3000/callback') // Должно совпадать с redirectUri интеграции
        const mode = 'post_message' // Режим авторизации, post_message - для получения кода через window.postMessage

        const authUrl = `https://www.amocrm.ru/oauth?client_id=${clientId}&state=${state}&redirect_uri=${redirectUri}&mode=${mode}`
        window.location.href = authUrl
    }

    async function exchangeCodeForToken(code) {
        const proxyUrl = 'http://localhost:3000/exchange-code' // Если сервер размещен на другом адресе - нужно изменить

        try {
            const response = await fetch(proxyUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code }),
            })

            if (!response.ok) {
                throw new Error(`Ошибка: ${response.status} ${response.statusText}`)
            }

            const tokenData = await response.json()
            return tokenData
        } catch (error) {
            throw error
        }
    }

    authButton.addEventListener("click", () => {
        authToAmoCRM()
    })

    exchangeButton.addEventListener("click", () => {
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get("code")

        if (code) {
            exchangeCodeForToken(code)
                .then((tokenData) => {
                    console.log(tokenData) // Если изначально выводится Access Token: undefined - еще раз нажать на кнопку обмена
                    output.innerHTML = `
                        <p>Access Token: ${tokenData.access_token}</p>
                        <p>Refresh Token: ${tokenData.refresh_token}</p>
                    `
                })
                .catch((error) => {
                    output.innerHTML = `<p style="color: red">Ошибка: ${error.message}</p>`
                })
        } else {
            output.innerHTML = `<p style="color: red">Код авторизации не найден в URL.</p>`
        }
    })
})