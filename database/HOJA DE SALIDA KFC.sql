USE LABORATORIO

CREATE TABLE EQUIPO(
    ID_EQUIPO INT PRIMARY KEY IDENTITY (1,1),
    NOMBRE_EQUIPO NVARCHAR(50) NOT NULL,
    MARCA_EQUIPO NVARCHAR(50),
    MODELO_EQUIPO NVARCHAR(50),
    SERIE_EQUIPO NVARCHAR(50),
    DESCRIPCION_EQUIPO NVARCHAR(250) -- Incrementado a 250 caracteres
);

CREATE TABLE RESPONSABLE(
    CEDULA_RESPONSABLE NVARCHAR(11) PRIMARY KEY NOT NULL, -- Cambio a NVARCHAR
    NOMBRES_RESPONSABLE NVARCHAR(50),
    APELLIDOS_RESPONSABLE NVARCHAR(50),
    CELULAR_RESPONSABLE NVARCHAR(15)
);

CREATE TABLE AUTORIZA(
    ID_AUTORIZA INT PRIMARY KEY IDENTITY(1,1),
    NOMBRES_AUTORIZA NVARCHAR(50),
    APELLIDOS_AUTORIZA NVARCHAR(50),
    CELULAR_AUTORIZA NVARCHAR(15)
);

CREATE TABLE DESTINO(
    ID_DESTINO INT PRIMARY KEY IDENTITY(1,1),
    NOMBRE_DESTINO NVARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE SALIDA (
    ID_SALIDA INT PRIMARY KEY IDENTITY(1,1),
    CEDULA_RESPONSABLE NVARCHAR(11), -- Cambio a NVARCHAR para mantener la consistencia
    ID_AUTORIZA INT,
    MOTIVO_SALIDA NVARCHAR(MAX),
    FECHA_HORA_SALIDA NVARCHAR(50),
    FECHA_SALIDA DATETIME,
    CONSTRAINT FK_SALIDA_RESPONSABLE FOREIGN KEY (CEDULA_RESPONSABLE) REFERENCES RESPONSABLE(CEDULA_RESPONSABLE),
    CONSTRAINT FK_SALIDA_AUTORIZA FOREIGN KEY (ID_AUTORIZA) REFERENCES AUTORIZA(ID_AUTORIZA)
);
ALTER TABLE SALIDA
ALTER COLUMN MOTIVO_SALIDA NVARCHAR(MAX);

CREATE NONCLUSTERED INDEX IDX_SALIDA_ID_FECHA
ON SALIDA (ID_SALIDA, FECHA_SALIDA);

CREATE TABLE SALIDA_EQUIPO_DETALLE (
    ID_DETALLE INT PRIMARY KEY IDENTITY(1,1),
    ID_SALIDA INT,
    ID_EQUIPO INT,
    ID_DESTINO INT,
    CANTIDAD INT NOT NULL,
    CONSTRAINT FK_Detalle_Salida FOREIGN KEY (ID_SALIDA) REFERENCES SALIDA(ID_SALIDA),
    CONSTRAINT FK_Detalle_Equipo FOREIGN KEY (ID_EQUIPO) REFERENCES EQUIPO(ID_EQUIPO),
    CONSTRAINT FK_Detalle_Destino FOREIGN KEY (ID_DESTINO) REFERENCES DESTINO(ID_DESTINO)
);

CREATE TABLE FOTO(
    ID_FOTO INT PRIMARY KEY IDENTITY(1,1),
    ID_SALIDA INT,
    IMAGEN_FOTO VARBINARY(MAX),
    CONSTRAINT FK_Foto_Salida FOREIGN KEY (ID_SALIDA) REFERENCES SALIDA(ID_SALIDA)
);

CREATE NONCLUSTERED INDEX IDX_FOTO_ID_SALIDA
ON FOTO (ID_SALIDA);

CREATE NONCLUSTERED INDEX IDX_FOTO_ID_FOTO
ON FOTO (ID_FOTO);

---------- PROCEDIMMIENTOS ALMACENADOS ----------

/* 
1. Procedimiento para Insertar en la Tabla SALIDA
Este procedimiento almacenado insertará la información del responsable
y del autorizador en sus respectivas tablas (si no existen) y luego 
insertará una nueva salida en la tabla SALIDA.
*/
CREATE OR ALTER PROCEDURE InsertarSalida
    @cedulaResponsable NVARCHAR(11),
    @nombresResponsable NVARCHAR(50),
    @apellidosResponsable NVARCHAR(50),
    @celularResponsable NVARCHAR(15),
    @nombresAutoriza NVARCHAR(50),
    @apellidosAutoriza NVARCHAR(50),
    @celularAutoriza NVARCHAR(15),
    @motivoSalida NVARCHAR(50),
    @fechaHoraSalida NVARCHAR(50),
    @fechaSalida DATETIME,
    @idSalida INT OUTPUT
AS
BEGIN
    BEGIN TRANSACTION;

    BEGIN TRY
        DECLARE @idAutoriza INT;

        -- Buscar si el responsable ya existe
        IF NOT EXISTS (SELECT 1 FROM RESPONSABLE WHERE CEDULA_RESPONSABLE = @cedulaResponsable)
        BEGIN
            -- Insertar un nuevo responsable si no existe
            INSERT INTO RESPONSABLE (CEDULA_RESPONSABLE, NOMBRES_RESPONSABLE, APELLIDOS_RESPONSABLE, CELULAR_RESPONSABLE)
            VALUES (@cedulaResponsable, @nombresResponsable, @apellidosResponsable, @celularResponsable);
        END

        -- Buscar si el autorizador ya existe
        IF EXISTS (SELECT 1 FROM AUTORIZA WHERE CELULAR_AUTORIZA = @celularAutoriza)
        BEGIN
            SET @idAutoriza = (SELECT ID_AUTORIZA FROM AUTORIZA WHERE CELULAR_AUTORIZA = @celularAutoriza);
        END
        ELSE
        BEGIN
            -- Insertar un nuevo autorizador si no existe
            INSERT INTO AUTORIZA (NOMBRES_AUTORIZA, APELLIDOS_AUTORIZA, CELULAR_AUTORIZA)
            VALUES (@nombresAutoriza, @apellidosAutoriza, @celularAutoriza);
            
            SET @idAutoriza = SCOPE_IDENTITY();
        END

        -- Insertar en la tabla SALIDA
        INSERT INTO SALIDA (CEDULA_RESPONSABLE, ID_AUTORIZA, MOTIVO_SALIDA, FECHA_HORA_SALIDA,FECHA_SALIDA)
        VALUES (@cedulaResponsable, @idAutoriza, @motivoSalida, @fechaHoraSalida,SYSDATETIME());

        -- Obtener el ID de la salida recién insertada
        SET @idSalida = SCOPE_IDENTITY();

        COMMIT TRANSACTION;
    END TRY

    BEGIN CATCH
        -- Manejo de errores
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END



/*
2. Procedimiento para Insertar en la Tabla SALIDA_EQUIPO_DETALLE
Este procedimiento almacenado insertará los detalles de la salida, 
incluyendo el equipo y su destino.
*/
CREATE OR ALTER PROCEDURE InsertarSalidaEquipoDetalle
    @idSalida INT,
    @nombreEquipo NVARCHAR(50),
    @marcaEquipo NVARCHAR(50),
    @modeloEquipo NVARCHAR(50),
    @serieEquipo NVARCHAR(50),
    @descripcionEquipo NVARCHAR(250),
    @nombreDestino NVARCHAR(50),
    @cantidad INT
AS
BEGIN
    BEGIN TRANSACTION;

    BEGIN TRY
        DECLARE @idEquipo INT;
        DECLARE @idDestino INT;

        -- Insertar el equipo directamente
        INSERT INTO EQUIPO (NOMBRE_EQUIPO, MARCA_EQUIPO, MODELO_EQUIPO, SERIE_EQUIPO, DESCRIPCION_EQUIPO)
        VALUES (@nombreEquipo, @marcaEquipo, @modeloEquipo, @serieEquipo, @descripcionEquipo);

        -- Obtener el ID del equipo recién insertado
        SET @idEquipo = SCOPE_IDENTITY();

        -- Buscar si el destino ya existe
        IF EXISTS (SELECT 1 FROM DESTINO WHERE NOMBRE_DESTINO = @nombreDestino)
        BEGIN
            SET @idDestino = (SELECT ID_DESTINO FROM DESTINO WHERE NOMBRE_DESTINO = @nombreDestino);
        END
        ELSE
        BEGIN
            -- Insertar un nuevo destino si no existe
            INSERT INTO DESTINO (NOMBRE_DESTINO)
            VALUES (UPPER(@nombreDestino));

            SET @idDestino = SCOPE_IDENTITY();
        END

        -- Insertar en la tabla SALIDA_EQUIPO_DETALLE
        INSERT INTO SALIDA_EQUIPO_DETALLE (ID_SALIDA, ID_EQUIPO, ID_DESTINO, CANTIDAD)
        VALUES (@idSalida, @idEquipo, @idDestino, @cantidad);

        COMMIT TRANSACTION;
    END TRY

    BEGIN CATCH
        -- Manejo de errores
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END



/*
3. Procedimiento para Insertar en la Tabla FOTO
Este procedimiento almacenado insertará las fotos asociadas a una salida específica.
*/
CREATE OR ALTER PROCEDURE InsertarFoto
    @idSalida INT,
    @imagenFoto VARBINARY(MAX)
AS
BEGIN
    BEGIN TRANSACTION;

    BEGIN TRY
        -- Asegurarse de que el ID de la salida es válido
        IF NOT EXISTS (SELECT 1 FROM SALIDA WHERE ID_SALIDA = @idSalida)
        BEGIN
            RAISERROR('ID de salida no existe.', 16, 1);
            RETURN;
        END

        -- Insertar la foto en la tabla FOTO
        INSERT INTO FOTO (ID_SALIDA, IMAGEN_FOTO)
        VALUES (@idSalida, @imagenFoto);

        COMMIT TRANSACTION;
    END TRY

    BEGIN CATCH
        -- Manejo de errores
        ROLLBACK TRANSACTION;

        -- Re-lanzar el error
        THROW;
    END CATCH
END


-- FUNCION TIPO TABLA PARA FILTRAR.

CREATE OR ALTER FUNCTION dbo.fn_FiltrarSalidasPorFecha
(
    @ID_SALIDA INT = NULL,
    @CEDULA_RESPONSABLE NVARCHAR(11) = NULL
)
RETURNS TABLE
AS
RETURN
(
    SELECT DISTINCT
        s.ID_SALIDA, -- Asegúrate de que esta columna esté seleccionada
        s.FECHA_HORA_SALIDA,
        r.NOMBRES_RESPONSABLE,
        r.APELLIDOS_RESPONSABLE,
        r.CELULAR_RESPONSABLE,
        e.NOMBRE_EQUIPO,
        e.MARCA_EQUIPO,
        e.MODELO_EQUIPO,
        e.SERIE_EQUIPO,
        e.DESCRIPCION_EQUIPO,
        sed.CANTIDAD,
        d.NOMBRE_DESTINO,
        s.MOTIVO_SALIDA,
        a.NOMBRES_AUTORIZA,
        a.APELLIDOS_AUTORIZA,
        a.CELULAR_AUTORIZA
    FROM
        SALIDA_EQUIPO_DETALLE sed
        INNER JOIN SALIDA s ON sed.ID_SALIDA = s.ID_SALIDA
        INNER JOIN RESPONSABLE r ON s.CEDULA_RESPONSABLE = r.CEDULA_RESPONSABLE
        INNER JOIN EQUIPO e ON sed.ID_EQUIPO = e.ID_EQUIPO
        INNER JOIN DESTINO d ON sed.ID_DESTINO = d.ID_DESTINO
        INNER JOIN AUTORIZA a ON s.ID_AUTORIZA = a.ID_AUTORIZA
    WHERE 
        (
            @ID_SALIDA IS NULL 
            OR @ID_SALIDA = '' 
            OR s.ID_SALIDA = @ID_SALIDA
        )
        AND 
        (
            @CEDULA_RESPONSABLE IS NULL 
            OR @CEDULA_RESPONSABLE = '' 
            OR s.CEDULA_RESPONSABLE LIKE '%' + @CEDULA_RESPONSABLE + '%'
        )
        AND 
        (
            CAST(CONVERT(DATETIME, s.FECHA_SALIDA, 101) AS DATE) = CAST(GETDATE() AS DATE)
        )
);


-- para q muestre solo id salida
CREATE OR ALTER FUNCTION dbo.fn_FiltrarSalidasPorFecha
(
    @ID_SALIDA INT = NULL,
    @CEDULA_RESPONSABLE NVARCHAR(11) = NULL
)
RETURNS TABLE
AS
RETURN
(
    SELECT DISTINCT
        s.ID_SALIDA,
        s.FECHA_HORA_SALIDA,
        CASE 

            WHEN (@ID_SALIDA IS NULL OR @ID_SALIDA = '') 
              AND (@CEDULA_RESPONSABLE IS NULL OR @CEDULA_RESPONSABLE = '') 
            THEN s.CEDULA_RESPONSABLE
            ELSE s.CEDULA_RESPONSABLE
        END AS CEDULA_RESPONSABLE,
        r.NOMBRES_RESPONSABLE,
        r.APELLIDOS_RESPONSABLE,
        CASE 
            
            WHEN NOT ((@ID_SALIDA IS NULL OR @ID_SALIDA = '') ) 
            THEN e.NOMBRE_EQUIPO 
        END AS NOMBRE_EQUIPO,
        CASE 
            WHEN NOT ((@ID_SALIDA IS NULL OR @ID_SALIDA = '') ) 
            THEN e.MARCA_EQUIPO 
        END AS MARCA_EQUIPO,
        CASE 
            WHEN NOT ((@ID_SALIDA IS NULL OR @ID_SALIDA = '') ) 
            THEN e.MODELO_EQUIPO 
        END AS MODELO_EQUIPO,
        CASE 
            WHEN NOT ((@ID_SALIDA IS NULL OR @ID_SALIDA = '') ) 
            THEN e.SERIE_EQUIPO 
        END AS SERIE_EQUIPO,
        CASE 
            WHEN NOT ((@ID_SALIDA IS NULL OR @ID_SALIDA = '') ) 
            THEN e.DESCRIPCION_EQUIPO 
        END AS DESCRIPCION_EQUIPO,
        CASE 
            WHEN NOT ((@ID_SALIDA IS NULL OR @ID_SALIDA = '') ) 
            THEN sed.CANTIDAD 
        END AS CANTIDAD,
        CASE 
            WHEN NOT ((@ID_SALIDA IS NULL OR @ID_SALIDA = '') ) 
            THEN d.NOMBRE_DESTINO 
        END AS NOMBRE_DESTINO,
        CASE 
            WHEN NOT ((@ID_SALIDA IS NULL OR @ID_SALIDA = '') ) 
            THEN s.MOTIVO_SALIDA 
        END AS MOTIVO_SALIDA,
        CASE 
            WHEN NOT ((@ID_SALIDA IS NULL OR @ID_SALIDA = '') ) 
            THEN a.NOMBRES_AUTORIZA 
        END AS NOMBRES_AUTORIZA,
        CASE 
            WHEN NOT ((@ID_SALIDA IS NULL OR @ID_SALIDA = '') ) 
            THEN a.APELLIDOS_AUTORIZA 
        END AS APELLIDOS_AUTORIZA,
        CASE 
            WHEN NOT ((@ID_SALIDA IS NULL OR @ID_SALIDA = '') ) 
            THEN a.CELULAR_AUTORIZA 
        END AS CELULAR_AUTORIZA
    FROM
        SALIDA_EQUIPO_DETALLE sed
        INNER JOIN SALIDA s ON sed.ID_SALIDA = s.ID_SALIDA
        INNER JOIN RESPONSABLE r ON s.CEDULA_RESPONSABLE = r.CEDULA_RESPONSABLE
        INNER JOIN EQUIPO e ON sed.ID_EQUIPO = e.ID_EQUIPO
        INNER JOIN DESTINO d ON sed.ID_DESTINO = d.ID_DESTINO
        INNER JOIN AUTORIZA a ON s.ID_AUTORIZA = a.ID_AUTORIZA
    WHERE 
        (
            @ID_SALIDA IS NULL 
            OR @ID_SALIDA = '' 
            OR s.ID_SALIDA = @ID_SALIDA
        )
        AND 
        (
            @CEDULA_RESPONSABLE IS NULL 
            OR @CEDULA_RESPONSABLE = '' 
            OR s.CEDULA_RESPONSABLE LIKE  @CEDULA_RESPONSABLE 
        )
        AND 
        (
            CAST(CONVERT(DATETIME, s.FECHA_SALIDA, 101) AS DATE) = CAST(GETDATE() AS DATE)
        )
);

--////////////////////////////
CREATE OR ALTER FUNCTION dbo.fn_FiltrarSalidasPorFecha
(
    @ID_SALIDA INT = NULL,
    @CEDULA_RESPONSABLE NVARCHAR(11) = NULL
)
RETURNS TABLE
AS
RETURN
(
    SELECT DISTINCT
        s.ID_SALIDA,
        s.FECHA_HORA_SALIDA,
        s.CEDULA_RESPONSABLE,
        r.NOMBRES_RESPONSABLE,
        r.APELLIDOS_RESPONSABLE,
        e.NOMBRE_EQUIPO,
        e.MARCA_EQUIPO,
        e.MODELO_EQUIPO,
        e.SERIE_EQUIPO,
        e.DESCRIPCION_EQUIPO,
        sed.CANTIDAD,
        d.NOMBRE_DESTINO,
        s.MOTIVO_SALIDA,
        a.NOMBRES_AUTORIZA,
        a.APELLIDOS_AUTORIZA,
        a.CELULAR_AUTORIZA
    FROM
        SALIDA_EQUIPO_DETALLE sed
        INNER JOIN SALIDA s ON sed.ID_SALIDA = s.ID_SALIDA
        INNER JOIN RESPONSABLE r ON s.CEDULA_RESPONSABLE = r.CEDULA_RESPONSABLE
        INNER JOIN EQUIPO e ON sed.ID_EQUIPO = e.ID_EQUIPO
        INNER JOIN DESTINO d ON sed.ID_DESTINO = d.ID_DESTINO
        INNER JOIN AUTORIZA a ON s.ID_AUTORIZA = a.ID_AUTORIZA
    WHERE 
        CAST(CONVERT(DATETIME, s.FECHA_SALIDA, 101) AS DATE) = CAST(GETDATE() AS DATE)
);


CREATE OR ALTER FUNCTION dbo.fn_FiltrarSalidasSinFecha
(
    @ID_SALIDA INT = NULL,
    @CEDULA_RESPONSABLE NVARCHAR(11) = NULL
)
RETURNS TABLE
AS
RETURN
(
    SELECT
        s.ID_SALIDA AS id_salida,
        s.FECHA_HORA_SALIDA AS fecha_hora_salida,
        s.CEDULA_RESPONSABLE AS cedula_responsable,
        r.NOMBRES_RESPONSABLE AS nombres_responsable,
        r.APELLIDOS_RESPONSABLE AS apellidos_responsable,
        e.NOMBRE_EQUIPO AS nombre_equipo,
        e.MARCA_EQUIPO AS marca_equipo,
        e.MODELO_EQUIPO AS modelo_equipo,
        e.SERIE_EQUIPO AS serie_equipo,
        e.DESCRIPCION_EQUIPO AS descripcion_equipo,
        sed.CANTIDAD AS cantidad,
        d.NOMBRE_DESTINO AS nombre_destino,
        s.MOTIVO_SALIDA AS motivo_salida,
        a.NOMBRES_AUTORIZA AS nombres_autoriza,
        a.APELLIDOS_AUTORIZA AS apellidos_autoriza,
        a.CELULAR_AUTORIZA AS celular_autoriza
    FROM
        SALIDA_EQUIPO_DETALLE sed
        INNER JOIN SALIDA s ON sed.ID_SALIDA = s.ID_SALIDA
        INNER JOIN RESPONSABLE r ON s.CEDULA_RESPONSABLE = r.CEDULA_RESPONSABLE
        INNER JOIN EQUIPO e ON sed.ID_EQUIPO = e.ID_EQUIPO
        INNER JOIN DESTINO d ON sed.ID_DESTINO = d.ID_DESTINO
        INNER JOIN AUTORIZA a ON s.ID_AUTORIZA = a.ID_AUTORIZA
    WHERE
        (@ID_SALIDA IS NULL OR s.ID_SALIDA = @ID_SALIDA) AND
        (@CEDULA_RESPONSABLE IS NULL OR s.CEDULA_RESPONSABLE = @CEDULA_RESPONSABLE)
);



-- reporte salidas
CREATE OR ALTER FUNCTION dbo.fn_ReporteSalidaDiaAnterior()
RETURNS TABLE
AS
RETURN
(
    SELECT DISTINCT
        s.ID_SALIDA,
        s.FECHA_HORA_SALIDA,
        s.CEDULA_RESPONSABLE,
        r.NOMBRES_RESPONSABLE,
        r.APELLIDOS_RESPONSABLE,
        e.NOMBRE_EQUIPO,
        e.MARCA_EQUIPO,
        e.MODELO_EQUIPO,
        e.SERIE_EQUIPO,
        e.DESCRIPCION_EQUIPO,
        sed.CANTIDAD,
        d.NOMBRE_DESTINO,
        s.MOTIVO_SALIDA,
        a.NOMBRES_AUTORIZA,
        a.APELLIDOS_AUTORIZA,
        a.CELULAR_AUTORIZA
    FROM
        SALIDA_EQUIPO_DETALLE sed
        INNER JOIN SALIDA s ON sed.ID_SALIDA = s.ID_SALIDA
        INNER JOIN RESPONSABLE r ON s.CEDULA_RESPONSABLE = r.CEDULA_RESPONSABLE
        INNER JOIN EQUIPO e ON sed.ID_EQUIPO = e.ID_EQUIPO
        INNER JOIN DESTINO d ON sed.ID_DESTINO = d.ID_DESTINO
        INNER JOIN AUTORIZA a ON s.ID_AUTORIZA = a.ID_AUTORIZA
    WHERE 
        CAST(CONVERT(DATETIME, s.FECHA_SALIDA, 101) AS DATE) = CAST(DATEADD(DAY, -1, GETDATE()) AS DATE)
);

select * from dbo.fn_ReporteSalidaDiaAnterior();





SELECT TOP 50 * FROM dbo.fn_FiltrarSalidasPorFecha(NULL,NULL)ORDER BY ID_SALIDA DESC;

--FILTRAR FOTOS POR SALIDA
SELECT F.IMAGEN_FOTO FROM FOTO F JOIN SALIDA S ON F.ID_SALIDA = S.ID_SALIDA WHERE S.ID_SALIDA = 3;--@CodigoSalida;


SELECT F.IMAGEN_FOTO
FROM FOTO F
JOIN SALIDA S ON F.ID_SALIDA = S.ID_SALIDA
WHERE CONVERT(DATE, S.FECHA_SALIDA) = CONVERT(DATE, GETDATE())
AND F.ID_SALIDA = 18;


CREATE OR ALTER FUNCTION dbo.fn_ImagenesSalida
(
    @id_salida INT
)
RETURNS TABLE
AS
RETURN
(
    SELECT F.IMAGEN_FOTO
    FROM FOTO F
    JOIN SALIDA S ON F.ID_SALIDA = S.ID_SALIDA
    WHERE CONVERT(DATE, S.FECHA_SALIDA) = CONVERT(DATE, GETDATE())
    AND F.ID_SALIDA = @id_salida
);

CREATE OR ALTER FUNCTION dbo.fn_ImagenesSalida2
(
    @id_salida INT
)
RETURNS TABLE
AS
RETURN
(
    SELECT 
        F.ID_SALIDA,      -- Añadido ID_SALIDA
        F.IMAGEN_FOTO
    FROM FOTO F
    JOIN SALIDA S ON F.ID_SALIDA = S.ID_SALIDA
    WHERE F.ID_SALIDA = @id_salida  -- Cambiado a WHERE para filtrar por id_salida
);


select * from dbo.fn_ImagenesSalida(17);


SELECT SYSDATETIME() AS CurrentDateTime2;

-- eliminar tablas
drop table FOTO
drop table SALIDA_EQUIPO_DETALLE
drop table SALIDA
drop table RESPONSABLE
drop table AUTORIZA
drop table DESTINO
drop table EQUIPO