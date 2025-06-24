'use client';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Cadastro.module.css';
import dynamic from 'next/dynamic';
const MapaComRaio = dynamic(
  () => import('@/components/MapaComRaio'),
  { 
    ssr: false,
    loading: () => <p>Carregando mapa...</p>
  }
);

export default function Cadastro() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    schoolName: '',
    longitude: -8.8383, // Valores iniciais de Luanda
    latitude: 13.2344,
    radius: 500, // Raio em metros
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

  const handleLocationChange = ({ lat, lng, radius }) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      radius: radius
    }));
  };

  const validateStep = (currentStep) => {
    setError('');
    
    if (currentStep === 1) {
      if (!formData.email || !formData.password || !formData.username) {
        setError('Por favor, preencha todos os campos');
        return false;
      }
      if (formData.password.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres');
        return false;
      }
    }

    if (currentStep === 2) {
      if (!formData.schoolName) {
        setError('Por favor, informe o nome da escola');
        return false;
      }
    }

    return true;
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!validateStep(step)) return;
    setStep(step + 1);
  };

  const handlePreviousStep = (e) => {
    e.preventDefault();
    setStep(step - 1);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateStep(3)) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/siggin/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
            longitude:formData.longitude.toString(),
            latitude: formData.latitude.toString(),
            radius: formData.radius
          }
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro no cadastro');
      }

      router.push('/login');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRedirectLogin = (e) => {
    e.preventDefault();
    router.push('/login');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Cadastro ({step}/3)</h2>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={step === 3 ? handleSubmit : handleNextStep}>
          {/* Passo 1: Dados da Conta */}
          {step === 1 && (
            <div className={styles.formSection}>
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
                <label className={styles.label}>Senha</label>
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

              <button type="submit" className={styles.button}>
                Próximo
              </button>
            </div>
          )}

          {/* Passo 2: Localização da Escola */}
          {step === 2 && (
            <div className={styles.formSection}>
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

              <div className={styles.mapContainer}>
                <h3 className={styles.subtitle}>Marque a localização da escola</h3>
                <MapaComRaio 
                  onChange={handleLocationChange}
                  initialPosition={{
                    lat: Number(formData.latitude),
                    lng: Number(formData.longitude)
                  }}
                  initialRadius={Number(formData.radius)}
                />
              </div>

              <div className={styles.buttonGroup}>
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className={`${styles.button} ${styles.buttonSecondary}`}
                >
                  Voltar
                </button>
                <button type="submit" className={styles.button}>
                  Próximo
                </button>
              </div>
            </div>
          )}

          {/* Passo 3: Configurações */}
          {step === 3 && (
            <div className={styles.formSection}>
              <div className={styles.formGroup}>
                <h3 className={styles.subtitle}>Configurações de Bloqueio</h3>
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
                    Bloquear Aplicativos
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
              </div>

              <div className={styles.locationPreview}>
                <h3 className={styles.subtitle}>Dados fornecidos</h3>
                <p>Escola: {formData.schoolName}</p>
                <p>Email: {formData.email}</p>
                <p>Username: {formData.username}</p>
                <p>Raio de Atuação: {formData.radius} metros</p>
              </div>

              <div className={styles.buttonGroup}>
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className={`${styles.button} ${styles.buttonSecondary}`}
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`${styles.button} ${loading ? styles.disabled : ''}`}
                >
                  {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
                </button>
              </div>
            </div>
          )}
        </form>

        <div className={styles.loginRedirect}>
          Já tem uma conta?{' '}
          <a href="#" onClick={handleRedirectLogin} className={styles.link}>
            Faça login
          </a>
        </div>
      </div>
    </div>
  );
}