import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import VueApollo from "vue-apollo";
import Vue from "vue";
import App from "./App.vue";
import router from "./router";

Vue.config.productionTip = false;

const httpLink = new HttpLink({
  // URL to graphql server, you should use an absolute URL here
  uri: "http://localhost:5000/graphql",
});

// create the apollo client
const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});

// install the vue plugin
Vue.use(VueApollo);

new Vue({
  router,
  render: (h) => h(App),
  apolloProvider,
}).$mount("#app");
