/* routes-list */

const APP_NAME = process.env.VUE_APP_NAME;

const App = () => import('./App.vue');
const Home = () => import('./views/Home.vue');
const About = () => import('./views/About.vue');
const Test = () => import('./views/Test.vue');
const TestA = () => import('./views/Testa.vue');

export default [
  {
    path: `/${APP_NAME}`,
    name: APP_NAME,
    redirect: { name: `${APP_NAME}.home` },
    component: App,
    children: [
      {
        path: 'home',
        name: `${APP_NAME}.home`,
        component: Home,
        redirect: { name: `${APP_NAME}.homePagetest` },
        children: [
          {
            path: 'test',
            name: `${APP_NAME}.homePagetest`,
            redirect: { name: `${APP_NAME}.homePagetestA` },
            component: Test,
            children: [
              {
                path: 'a',
                name: `${APP_NAME}.homePagetestA`,
                component: TestA
              }
            ]
          }
        ]
      },
      {
        path: 'about',
        name: `${APP_NAME}.about`,
        component: About,
      },
    ],
  },
];
