import React, { lazy } from "react";
import { Navigate } from "react-router-dom";
import Root from "@/layout/root";
import Login from "@/views/login";
import ArticleList from "@/views/article/list";
import NotFound from "@/views/error-pages/404";
const Home = lazy(() => import("@/views/home"));
const Article = lazy(() => import("@/views/article"));
const Tags = lazy(() => import("@/views/article/tags"));
const AddArtile = lazy(() => import("@/views/article/add"));
const FileAdmin = lazy(() => import("@/views/website/file"))
const Visitor = lazy(() => import("@/views/website/visitor"))
const Password = lazy(() => import('@/views/user/password'))
const UserInfo = lazy(() => import('@/views/user/info'))

export const routes = [
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "",
        element: <Home />,
        meta: {
          roles: ["admin"],
          title: "admin",
          key: "admin",
        },
      },
      {
        path: "article",
        element: <Article />,
        meta: {
          roles: ["admin"],
          title: "Article Management",
          key: "article",
        },
      },
      {
        path: "/article/list",
        element: <ArticleList />,
        meta: {
          roles: ["admin"],
          title: "Article list",
          key: "/article/list",
        },
      },
      {
        path: "/article/tags",
        element: <Tags />,
        meta: {
          roles: ["admin"],
          title: "article tag",
          key: "/article/tags",
        },
      },
      {
        path: "/article/add",
        element: <AddArtile />,
        meta: {
          roles: ["admin"],
          title: "Add article",
          key: "/article/add",
        },
      },
      {
        path: "/websit/file",
        element: <FileAdmin />,
        meta: {
          roles: ["admin"],
          title: "File management",
          key: "/websit/file",
        },
      },
      {
        path: "/websit/vistor",
        element: <Visitor />,
        meta: {
          roles: ["admin"],
          title: "Visitor statistics",
          key: "/websit/vistor",
        },
      },
      {
        path: "/user/password",
        element: <Password />,
        meta: {
          roles: ["admin"],
          title: "change Password",
          key: "/user/password",
        },
      },
      {
        path: '/user/info',
        element: <UserInfo />,
        meta: {
          roles: ["admin"],
          title: "User Info",
          key: '/user/info'
        }
      }
    ],
  },
  {
    path: "/login",
    element: <Login />,
    meta: {
      roles: [],
      title: "Log In",
      key: "login",
    },
  },
  {
    path: "/404",
    element: <NotFound />,
    meta: {
      roles: [],
      title: "404 page",
      key: "404",
    },
  },
  {
    path: "*",
    element: <Navigate to="/404" />,
  },
];

export default routes;
