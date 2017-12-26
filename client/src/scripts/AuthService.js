import api from '@/services/api'

export default {
    register(credentials) {
        return api().post('register', credentials)
    }
}

/*
AuthService.register({
    email: 'hugo@thegonzalez.design',
    password: 'the one and only'
})
*/
