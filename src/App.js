import React from 'react';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import theme from './theme/theme';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Layout from './components/layout/Layout';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Home from './components/Home';
import ClientList from './components/clients/ClientList';
import ClientForm from './components/clients/ClientForm';
import NotFound from './components/common/NotFound';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Switch>
            {/* Public Routes */}
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />

            {/* Protected Routes with Layout */}
            <ProtectedRoute exact path="/home">
              <Layout>
                <Home />
              </Layout>
            </ProtectedRoute>

            <ProtectedRoute exact path="/clients">
              <Layout>
                <ClientList />
              </Layout>
            </ProtectedRoute>

            <ProtectedRoute exact path="/clients/new">
              <Layout>
                <ClientForm />
              </Layout>
            </ProtectedRoute>

            <ProtectedRoute exact path="/clients/edit/:id">
              <Layout>
                <ClientForm />
              </Layout>
            </ProtectedRoute>

            {/* Default redirect */}
            <Route exact path="/">
              <Redirect to="/login" />
            </Route>

            {/* 404 Not Found */}
            <Route component={NotFound} />
          </Switch>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
