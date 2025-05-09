const express = require('express')
const path = require('path')
const cors = require('cors')
const fetch = require('node-fetch')

const app = express()
const PORT = 3000

app.use(cors())

// URL для обработки статических файлов фронта
app.use(express.static(path.join(__dirname, '../public')))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'))
})

app.get('/callback', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'))
})

// Обработка POST-запроса на /exchange-code
app.post('/exchange-code', async (req, res) => {
    const { code } = req.body
    const clientId = '69dfaa0a-020b-45b2-bac9-105f2158cad0' // ID Интеграции
    const clientSecret = 'NB9J1epvjzLNjmSrDT3cZVPqCZLvRXYZcX8EOFfU4dN9N4zR8XuCjmUv46pbFtDV' // SECRET KEY Интеграции
    const redirectUri = 'http://localhost:3000/callback'  // RedirectURL Интеграции
    const tokenUrl = 'https://domen.amocrm.ru/oauth2/access_token' 
    // domen - это имя вашего аккаунта amoCRM. Можно так же узнать, перейдя по amocrm.ru и выбрав аккаунт,
    // в поле url перед amocrm.ru будет ваш домен ( пример, rondodolo.amocrm.ru, rondodolo - домен )

    try {
        const response = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: redirectUri,
            }),
        })

        const tokenData = await response.json()
        res.json(tokenData)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`)
})
