@echo on
setlocal enabledelayedexpansion

:: Manter a janela aberta mesmo se ocorrer erro
cd /d "%~dp0"

echo Iniciando conversao de PNG para WebP...
echo.

:: Verificar se o cwebp está disponível
where cwebp
if %errorlevel% neq 0 (
    echo ERRO: cwebp nao encontrado no sistema.
    echo Por favor, instale o cwebp primeiro.
    goto :end
)

:: Verificar se existem arquivos PNG
dir *.png /b /a-d > nul 2>&1
if %errorlevel% neq 0 (
    echo Nenhum arquivo PNG encontrado para converter.
    goto :end
)

:: Criar pasta temporária
if not exist temp mkdir temp

echo Convertendo arquivos PNG para WebP...
echo.

:: Processar cada arquivo PNG
for %%F in (*.png) do (
    echo Processando: %%F
    set "nome=%%~nF"
    
    if exist "!nome!.webp" (
        echo - Pulando: arquivo WebP já existe
    ) else (
        echo - Convertendo para WebP...
        
        :: Converter usando cwebp com parâmetros básicos
        cwebp -q 90 "%%F" -o "temp\!nome!.webp"
        
        :: Verificar resultado
        if exist "temp\!nome!.webp" (
            move /y "temp\!nome!.webp" "!nome!.webp" > nul
            if exist "!nome!.webp" (
                del "%%F"
                echo - Conversão bem-sucedida e PNG excluído
            ) else (
                echo - ERRO: Falha ao mover o arquivo WebP
            )
        ) else (
            echo - ERRO: Falha na conversão
        )
    )
    echo.
)

:: Limpar pasta temporária
rd /s /q temp 2> nul

echo Processo concluído!

:end
echo.
echo Pressione qualquer tecla para sair...
pause