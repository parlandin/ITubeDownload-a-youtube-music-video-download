import { createGlobalStyle } from "styled-components";

const Global = createGlobalStyle`
    html {
        font-family:  'Roboto', sans-serif;
        font-size:16px;
       /*  scrollbar-color: #FFC690 #FFD8B4; */
        scrollbar-width: thin;
        scroll-behavior: smooth;

        ::-webkit-scrollbar {
            width: 3px;
        }

        ::-webkit-scrollbar-track {
            background: #0c0c0c;
            border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
            background: #feffff1a;
            border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: #1E1E1E;
        }
    }

    body {
        background-color: transparent;
        /* -webkit-app-region: drag; */

    }

`;

export default Global;
