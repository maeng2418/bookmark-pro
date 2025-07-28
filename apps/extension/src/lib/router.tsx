import { createBrowserRouter, createMemoryRouter } from 'react-router-dom';
import { Routes } from '../routes';

// Chrome 확장프로그램 환경인지 확인
const isChromeExtension = typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id;

// 환경에 따라 적절한 라우터 생성
export const router = isChromeExtension 
  ? createMemoryRouter(Routes) 
  : createBrowserRouter(Routes);