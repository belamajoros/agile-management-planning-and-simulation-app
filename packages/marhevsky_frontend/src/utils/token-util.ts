import jwt_decode from 'jwt-decode';

const TokenUtilService = {
    storeTokenToStorage(token: string) {
        localStorage.setItem('jwt_token', token)
    },
    parseTokenFromStorage(): string {
        const jwtFromStorage = localStorage.getItem('jwt_token');
        if (jwtFromStorage) {
            return jwtFromStorage;
        } else {
            console.log('JWT token session is empty !');
            return "";
        }
    },
    getCurrentUserId(): string | null {
        const jwtFromStorage = localStorage.getItem('jwt_token');
        if (jwtFromStorage) {
            const decodedToken = getDecodedAccessToken(jwtFromStorage);
            return decodedToken.id;
        }
        return null;
    },
    getCurrentUserName(): string | null {
        const user = localStorage.getItem('user');
        if(user) {
            const username = JSON.parse(user).user.name;
            return username;
        }
        return null;
    },
    invalidateToken(): boolean {
        localStorage.removeItem('jwt_token');

        return !localStorage.getItem('jwt_token');
    },
    isTokenValid(): boolean {
        const jwtFromStorage = localStorage.getItem('jwt_token');
        if (jwtFromStorage) {
            const decodedToken = getDecodedAccessToken(jwtFromStorage);
            return Date.now() < decodedToken.exp * 1000;
        } else {
            this.invalidateToken();
            return false;
        }
    },
    isAdmin(): boolean {
        const jwtFromStorage = localStorage.getItem('jwt_token');
        if (jwtFromStorage) {
            const decodedToken = getDecodedAccessToken(jwtFromStorage);
            console.log(decodedToken);
            return decodedToken.id === "643c2d55a8ac3f496f7adf3f";
        } else {
            return false;
        }
    }
};

function getDecodedAccessToken(token: string): any {
    try {
        return jwt_decode(token);
    } catch (Error) {
        return null;
    }
}

export default TokenUtilService;