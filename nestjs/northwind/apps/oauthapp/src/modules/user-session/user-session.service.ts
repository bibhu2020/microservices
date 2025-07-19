import { Injectable, Inject, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request, Response } from 'express';

@Injectable({ scope: Scope.REQUEST }) // one instance per request
export class UserSessionService {
  constructor(@Inject(REQUEST) private readonly request: Request) {}
  private readonly isProduction = process.env.NODE_ENV === 'production';
  private readonly cookieOptions = {
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    secure: this.isProduction, // Ensures the cookie is sent over HTTPS in production
    maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    
  };

  // --- Getters ---
  get user() {
    return this.request.cookies['user'] || '';
  }

  get userName() {
    return this.request.cookies['userName'] || '';
  }

  get roles(): string[] {
    const roles = this.request.cookies['roles'];
    return roles ? JSON.parse(roles) : [];
  }

  get userId() {
    return this.request.cookies['userId'] || '';
  }

  get accessToken() {
    return this.request.cookies['accessToken'] || '';
  }

  // --- Setters ---
  setUser(response: Response, value: Object | null) {
    response.cookie('user', JSON.stringify(value), this.cookieOptions);
  }

  setUserName(response: Response, value: string | undefined) {
    response.cookie('userName', value, this.cookieOptions);
  }

  setRoles(response: Response, roles: string[]) {
    response.cookie('roles', JSON.stringify(roles), this.cookieOptions);
  }

  setUserId(response: Response, value: string | undefined) {
    response.cookie('userId', value, this.cookieOptions);
  }

  setAccessToken(response: Response, value: string) {
    response.cookie('accessToken', value, this.cookieOptions);
  }

  // --- Clear all ---
  clear(response: Response) {
    ['user', 'userName', 'roles', 'userId', 'accessToken'].forEach((key) =>
      response.clearCookie(key),
    );
  }
}