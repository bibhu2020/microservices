// auth.controller.ts
import { Controller, Get, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserSessionService } from '../user-session/user-session.service';
import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';

@Controller('auth')
export class AuthController {
  constructor(private readonly AuthService: AuthService, 
              private readonly UserSessionService: UserSessionService
  ) {}

  @Get('login')
  async login(@Res() res: Response) {
    const authCodeUrlParameters = {
      scopes: ['openid', 'profile', 'email'],
      redirectUri: process.env.AUTH_REDIRCET_URL || '',
    };

    const client = this.AuthService.getClient();
    const authCodeUrl = await client.getAuthCodeUrl(authCodeUrlParameters);
    res.redirect(authCodeUrl);
  }

  @Get('redirect')
  async redirect(@Req() req: Request, @Res() res: Response) {
    const isProduction = process.env.NODE_ENV === 'production';

    const tokenRequest = {
      code: req.query.code as string,
      scopes: ['openid', 'profile', 'email'],
      redirectUri: process.env.AUTH_REDIRCET_URL || '',
    };

    const client = this.AuthService.getClient();
    const authResponse = await client.acquireTokenByCode(tokenRequest);
    if (!authResponse) {
      return res.status(500).send('Authentication failed');
    }
    else {
      
      if (authResponse) {
        this.UserSessionService.setUser(res, authResponse.account);
      }
      
      if (authResponse.account) {
        this.UserSessionService.setUserName(res, authResponse.account.name);
      }

      if (authResponse.accessToken) {
        this.UserSessionService.setAccessToken(res, authResponse.accessToken);
      }

      // Add roles and userId to cookies if available
      if (authResponse.account && authResponse.account.idTokenClaims) {
        const roles = authResponse.account.idTokenClaims.roles || [];
        const userId = authResponse.account.idTokenClaims.oid || authResponse.account.idTokenClaims.sub;

        this.UserSessionService.setRoles(res, roles);
        this.UserSessionService.setUserId(res, userId);
      }

      res.clearCookie('activeNavItem');
      res.redirect('/auth/profile');
    }
  }

  private async downloadUserPhoto(accessToken: string, userId: string): Promise<string> {
    try {
      const outputPath = path.join(process.cwd(), '/public/photos/'); // Output directory
  
      // Ensure the output directory exists
      if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
      }
  
      // Define the photo file path
      const photoPath = path.join(outputPath, `${userId}.jpg`);
      if (fs.existsSync(photoPath)) {
        return `/photos/${userId}.jpg`;
      }
  

      // Fetch the user's photo using Axios
      const response = await axios.get(`https://graph.microsoft.com/v1.0/users/${userId}/photo/$value`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'image/jpeg',
        },
        responseType: 'arraybuffer', // Important to get the binary data
      });
  
      // Write the photo to a local file
      fs.writeFileSync(photoPath, response.data);

      // Return the relative image URL for use in the frontend
      return `/photos/${userId}.jpg`;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Handle the case where the photo is not found
        console.log('User photo not found.');
        return '/images/profile.jpg'; // Return a placeholder image URL
      } else {
        // Re-throw the error if it's not a 404
        throw error;
      }
    }
  }

  @Get('profile') 
  async profile(@Req() req: Request, @Res() res: Response) {
    const user = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    const userName = req.cookies.userName;
    const roles = req.cookies.roles;
    const userId = req.cookies.userId;
    const accessToken = req.cookies.accessToken;

    console.log('dowloading profile');

    // Check if the user cookie exists
    if (!user) {
      return res.status(401).send('Unauthorized: User not logged in.');
    }

    // Parse roles safely
    const parsedRoles = roles ? JSON.parse(roles) : [];

    try {
      await this.downloadUserPhoto(accessToken,userId);
    }catch (err) {
        console.log('Photo not found: ' + err);
    }

    // Render the profile page with user information
    return res.render('auth/profile', {
      user: user,
      userName: userName || 'Unknown User',
      roles: parsedRoles,
      userId: userId || 'Unknown User ID',
    });
  }

  @Get('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const protocol = req.protocol; // 'http' or 'https'
    const host = req.get('host'); // 'localhost:3000' or 'example.com'
    const baseUrl = `${protocol}://${host}`;

    // Clear the user cookie
    // res.clearCookie('user');
    // res.clearCookie('userName');
    // res.clearCookie('roles');
    // res.clearCookie('userId');
    // res.clearCookie('accessToken');
    this.UserSessionService.clear(res);

    res.redirect(`https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/logout?post_logout_redirect_uri=${baseUrl}`);
  }
}
