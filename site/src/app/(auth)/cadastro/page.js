'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Cadastro.module.css';

export default function Cadastro() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    schoolName: '',
    longitude: '',
    latitude: '',
    blockCam: false,
    blockInternet: false,
    blockApps: false,
    blockSites: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.email || !formData.password || !formData.username) {
        setError('Por favor, preencha todos os campos');
        return;
      }
      if (formData.password.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres');
        return;
      }
    }
    setStep(step + 1);
    setError('');
  };

  const handlePreviousStep = (e) => {
    e.preventDefault();
    setStep(step - 1);
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/siggin/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          accountData: {
            email: formData.email,
            password: formData.password
          },
          userData: {
            name: formData.username,
          },
          schoolData: {
            name: formData.schoolName,
            blockCam: formData.blockCam,
            blockInternet: formData.blockInternet,
            blockSites: formData.blockSites,
            blockApps: formData.blockApps
          },
          locationData: {
            longitude: formData.longitude,
            latitude: formData.latitude
          }
        })
      });

      if (response.status != 200) {
        const data = await response.json();
        throw new Error(data.error);
      }

      router.push(response.url);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRedirectLogin = (event) => {
    event.preventDefault();
    router.push('/login');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Cadastro ({step}/2)</h2>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        <form onSubmit={step === 2 ? handleSubmit : handleNextStep}>
          {step === 1 && (
            <div className={styles.formGroup}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className={styles.input}
                />
              </div>

              <button
                type="submit"
                className={styles.button}
              >
                Próximo
              </button>
            </div>
          )}

          {step === 2 && (
            <div className={styles.formGroup}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Nome da Escola</label>
                <input
                  type="text"
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Longitude</label>
                <input
                  type="text"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Latitude</label>
                <input
                  type="text"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="blockCam"
                    checked={formData.blockCam}
                    onChange={handleChange}
                    className={styles.checkbox}
                  />
                  Bloquear Câmera
                </label>

                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="blockInternet"
                    checked={formData.blockInternet}
                    onChange={handleChange}
                    className={styles.checkbox}
                  />
                  Bloquear Internet
                </label>

                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="blockApps"
                    checked={formData.blockApps}
                    onChange={handleChange}
                    className={styles.checkbox}
                  />
                  Bloquear Apps
                </label>

                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="blockSites"
                    checked={formData.blockSites}
                    onChange={handleChange}
                    className={styles.checkbox}
                  />
                  Bloquear Sites
                </label>
              </div>

              <div className={styles.buttonGroup}>
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className={`${styles.button} ${styles.buttonSecondary} ${styles.buttonFlex}`}
                >
                  Voltar
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className={`${styles.button} ${styles.buttonFlex} ${loading ? styles.disabled : ''}`}
                >
                  {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
                </button>
              </div>
            </div>
          )}
        </form>

        <div className={styles.textCenter}>
          Já tem uma conta?{' '}
          <a
            href="#"
            onClick={handleRedirectLogin}
            className={styles.link}
          >
            Faça login
          </a>
        </div>
      </div>
    </div>
  );
}