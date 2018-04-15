import * as vscode from 'vscode';
import fs = require('fs-extra');
import * as path from 'path';

export default function soql(): any {
    vscode.window.forceCode.statusBarItem.text = 'ForceCode: Run SOQL Query';

    let options: vscode.InputBoxOptions = {
        placeHolder: 'Enter SOQL query',
        prompt: `Enter a SOQL query to get the results in a json file in the soql folder`,
    };
    return vscode.window.showInputBox(options).then(query => {
        return vscode.window.forceCode.dxCommands.soqlQuery(query).then(res => {
            let filePath: string = vscode.workspace.rootPath + path.sep + 'soql' + path.sep + Date.now() + '.json';
            var data: string = vscode.window.forceCode.dxCommands.outputToString(res.records);
            return fs.outputFile(filePath, data, function() {
                return vscode.workspace.openTextDocument(filePath).then(doc => { 
                    vscode.window.showTextDocument(doc);
                    vscode.window.forceCode.statusBarItem.text = "ForceCode: Successfully executed query!";
                    vscode.window.forceCode.resetMenu();
                });
            });
        })
        .catch(onError);
    });

    function onError(err) {
        vscode.window.forceCode.statusBarItem.text = "ForceCode: Error running query";
        vscode.window.forceCode.resetMenu();
        vscode.window.forceCode.outputError({ message: err }, vscode.window.forceCode.outputChannel);
    }
    // =======================================================================================================================================
}
