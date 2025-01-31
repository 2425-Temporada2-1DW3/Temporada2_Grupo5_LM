<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
      <!-- Configuración básica de la transformación -->
      <xsl:output method="html" indent="yes" />
      <!-- Plantilla para cada partido -->
      <xsl:template match="/temporada/jornadas/jornada">
            <table>
                  <tr class="righteous">
                        <th class="title2">Equipo local</th>
                        
                        <th colspan="2" class="title2">pts Local</th>
                        <th class="title2">Equipo Visitante</th>
                        
                         <th class="title2">pts Visitante</th>
                  </tr>

                  <!-- Iterar sobre los equipos en la clasificación -->
                  <xsl:for-each select="/temporada/jornadas/jornada/partidos/partido">
                        <tr class="quicksand">
                              <td>
                                    <!-- Mostrar posición -->
                                    <xsl:value-of select="equipo_local/NombreLocal" />
                              </td>
                              
                              <td>
                                    <!-- Nombre del equipo -->
                                    <xsl:value-of select="equipo_local/puntuacion" />
                              </td>
                               <td>
                                    <!-- Mostrar posición -->
                                    <xsl:value-of select="equipo_visitante/NombreVisitante" />
                              </td>
                             
                              <td>
                                    <!-- Nombre del equipo -->
                                    <xsl:value-of select="equipo_visitante/puntuacion" />
                              </td>
                        </tr>
                  </xsl:for-each>

            </table>

      </xsl:template>
</xsl:stylesheet>