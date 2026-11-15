package com.mdzvtt.shmap.ai.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import tools.jackson.databind.JsonNode;

public record ResponseFormat(String type, @JsonProperty("json_schema") JsonSchemaFormat jsonSchema) {
    public static ResponseFormat jsonSchema(String name, JsonNode schema) {
        return new ResponseFormat("json_schema", new JsonSchemaFormat(name, true, schema));
    }

    public record JsonSchemaFormat(String name, boolean strict, JsonNode schema) {
    }
}
