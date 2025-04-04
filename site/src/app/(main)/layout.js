import Menu from "../../components/Menu";
export default function RootLayout({ children }) {
  return (
    <>
     
	<Menu />
        {children}

    </>
  );
}
