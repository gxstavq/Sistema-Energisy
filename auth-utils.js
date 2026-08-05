/**
 * Utilitários compartilhados de identidade do usuário autenticado.
 */
(() => {
  "use strict";

  function formatFirstName(value) {
    const normalizedValue = String(value || "")
      .trim()
      .replace(/[._-]+/g, " ");
    const firstName = normalizedValue.split(/\s+/)[0] || "Usuário";

    return (
      firstName.charAt(0).toLocaleUpperCase("pt-BR") +
      firstName.slice(1).toLocaleLowerCase("pt-BR")
    );
  }

  function getFirstName(user) {
    const metadata = user?.user_metadata || {};
    const metadataName =
      metadata.full_name ||
      metadata.fullName ||
      metadata.name ||
      metadata.nome ||
      metadata.nome_completo ||
      metadata.display_name ||
      metadata.given_name ||
      metadata.first_name;

    if (String(metadataName || "").trim()) {
      return formatFirstName(metadataName);
    }

    const emailName = String(user?.email || "")
      .split("@")[0]
      .split("+")[0];

    return formatFirstName(emailName);
  }

  function getGreeting(user) {
    return `Boas-vindas, ${getFirstName(user)}`;
  }

  window.EnergisyAuth = Object.freeze({
    getFirstName,
    getGreeting,
  });
})();
