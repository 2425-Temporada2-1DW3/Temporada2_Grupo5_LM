<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <!-- Define el template principal para transformar el XML -->
  <xsl:template match="/">

    <table>
      <tr class="righteous">
        <th class="title2">Posición</th>
        <th colspan="2" class="title2">Equipo</th>
        <th class="title2">Puntos</th>
      </tr>

      <!-- Iterar sobre los equipos en la clasificación de la temporada iniciada y no finalizada -->
      <xsl:for-each select="/temporada[iniciado='true' and finalizado='false']/clasificacion/equipo">
        <tr class="quicksand">
          <td>
            <!-- Mostrar posición -->
            <xsl:value-of select="posicion" />
          </td>
          <td class="logoContainer">
            <!-- Mostrar el logo del equipo -->
            <img src="./imagenes/logos/logo.png" />
          </td>
          <td>
            <!-- Nombre del equipo -->
            <xsl:value-of select="nombre" />
          </td>
          <td>
            <!-- Puntos totales -->
            <xsl:value-of select="puntosTotales" />
          </td>
        </tr>
      </xsl:for-each>

    </table>

  </xsl:template>

</xsl:stylesheet>
