import { environment } from '../../../environments/environment';

export const APP_APIS = {
  AUTH: {
    signIn: `${environment.baseUrl}users/signin`,
    signUp: `${environment.baseUrl}users/signup`,
    changePassword: `${environment.baseUrl}users/change-password`,
    userData: `${environment.baseUrl}users/profile-data`,
    changePhotoProfile: `${environment.baseUrl}users/upload-photo`,
  },
  POSTS: {
    posts: `${environment.baseUrl}posts`,
  },
  Comments: {
    comment: `${environment.baseUrl}comments`,
  },
};
