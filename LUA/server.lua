local QBCore = exports['qb-core']:GetCoreObject()
RegisterNetEvent("LTW:RegistraServer", function(username, password, nome, cognome, data, domanda, risposta)
    local player = QBCore.Functions.GetPlayer(source)
    local src = source
    MySQL.Async.fetchAll('SELECT NomeUtente FROM ltwtable WHERE NomeUtente = @username', {
        ['@username'] = username,
    }, function(result)
        if result and #result > 0 then
            TriggerClientEvent("QBCore:Notify", src, "Nome utente già in uso", 'error')
        else
            MySQL.Async.insert("INSERT INTO ltwtable (NomeUtente, Password, CitizenID, Nome, Cognome, Data, Domanda, Risposta) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", {
                username,
                password,
                player.PlayerData.citizenid,
                nome,
                cognome,
                data,
                domanda,
                risposta
                })
                TriggerClientEvent("QBCore:Notify", source, "Ti sei registrato con successo!", 'success')
        end
    end)
end)

RegisterNetEvent("LTW:LoginServer", function(username, password)    
    local src = source
    MySQL.Async.fetchAll('SELECT NomeUtente, Password FROM ltwtable WHERE NomeUtente = @username AND Password = @password', {
        ['@username'] = username,
        ['@password'] = password,
    }, function(result)
        if result and #result > 0 then
            print("Login riuscito")
            print("source:", src)
            TriggerClientEvent("QBCore:Notify", src, "Login riuscito", 'success')
        else
            print("Nome utente o password errati")
            print("source:", src)
            TriggerClientEvent("QBCore:Notify", src, "Nome utente o password errati", 'error')
        end
    end)
end)

RegisterNetEvent("LTW:ResetPswServer", function(username, data, domanda, risposta, password)    
    local src = source
    MySQL.Async.fetchAll('SELECT NomeUtente, Data, Domanda, Risposta FROM ltwtable WHERE NomeUtente = @username AND Data = @data AND Domanda = @domanda AND Risposta = @risposta', {
        ['@username'] = username,
        ['@data'] = data,
        ['@domanda'] = domanda,
        ['@risposta'] = risposta,
    }, function(result)
        if result and #result > 0 then
            print("Cambio psw riuscito")
            print("source:", src)
            TriggerClientEvent("QBCore:Notify", src, "Cambio psw riuscito", 'success')
            MySQL.Async.execute('UPDATE ltwtable SET password = @password WHERE NomeUtente = @username AND Data = @data AND Domanda = @domanda AND Risposta = @risposta', {
                ['@password'] = password,
                ['@username'] = username,
                ['@data'] = data,
                ['@domanda'] = domanda,
                ['@risposta'] = risposta,
            })
        else
            print("Cambio psw non riuscito")
            print("source:", src)
            TriggerClientEvent("QBCore:Notify", src, "Cambio psw non riuscito", 'error')
        end
    end)
end)

