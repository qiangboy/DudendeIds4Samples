#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 5003

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["JsClientWeb/JsClientWeb.csproj", "JsClientWeb/"]
RUN dotnet restore "JsClientWeb/JsClientWeb.csproj"
COPY . .
WORKDIR "/src/JsClientWeb"
RUN dotnet build "JsClientWeb.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "JsClientWeb.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

ENV ASPNETCORE_URLS http://*:5003

ENTRYPOINT ["dotnet", "JsClientWeb.dll"]