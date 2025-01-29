<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <!-- Define el template principal para transformar el XML -->
  <xsl:template match="/">
    <!-- Contar el número de jornadas y agregarlas en la lista -->
    <div id="jornadas" class="quicksand">
      <ul class="lista">
        <xsl:for-each select="/temporada/jornadas/jornada">
          <li data-id="{id_jornada}">
            <xsl:value-of select="concat('Jornada ', number(id_jornada) + 1)" />
          </li>
        </xsl:for-each>

      </ul>
    </div>

  </xsl:template>

</xsl:stylesheet>