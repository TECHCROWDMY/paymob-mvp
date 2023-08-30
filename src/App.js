import { BrowserRouter } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
// routes
import $ from 'jquery';
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';
import * as skyid from "./assets/src_assets_skyid_impl_v1"; // Location of 'skyid_impl_v1.js' file

// ----------------------------------------------------------------------

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider>
          <Helmet>
            <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs/dist/tf.min.js" />
            <script src="https://webrtc.github.io/adapter/adapter-latest.js" />
            <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.2/jquery.min.js" />
            <script src="./skyid_fa_sdk_bundle.js" />
            <script src="./skyid_imp.js" type="module" />
          </Helmet>
          <ScrollToTop />
          <StyledChart />
          <Router />
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
