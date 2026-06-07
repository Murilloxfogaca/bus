FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copia arquivos de projeto primeiro para cache de restore
COPY OnibusExpress.sln ./
COPY src/OnibusExpress.Domain/OnibusExpress.Domain.csproj           src/OnibusExpress.Domain/
COPY src/OnibusExpress.Application/OnibusExpress.Application.csproj src/OnibusExpress.Application/
COPY src/OnibusExpress.Infrastructure/OnibusExpress.Infrastructure.csproj src/OnibusExpress.Infrastructure/
COPY src/OnibusExpress.Api/OnibusExpress.Api.csproj                 src/OnibusExpress.Api/
COPY tests/OnibusExpress.Tests/OnibusExpress.Tests.csproj           tests/OnibusExpress.Tests/

RUN dotnet restore

COPY . .

RUN dotnet test tests/OnibusExpress.Tests/OnibusExpress.Tests.csproj \
    -c Release --no-restore --logger "console;verbosity=normal"

RUN dotnet publish src/OnibusExpress.Api/OnibusExpress.Api.csproj \
    -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "OnibusExpress.Api.dll"]
